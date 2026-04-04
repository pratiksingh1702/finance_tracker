# API Issue Report — FUNCTION_INVOCATION_TIMEOUT

## Summary

Two API calls made from the Flutter app to the Vercel-hosted backend both failed with a **504 Gateway Timeout** (`FUNCTION_INVOCATION_TIMEOUT`). The server at `https://be-vayuxi-chi.vercel.app` did not respond within Vercel's serverless function execution limit, causing Dio to throw a `DioExceptionType.badResponse`. The offline queue saved one of the requests for later retry, but neither upload succeeded.

---

## API Call 1 — Rate Upload CSV

| Field        | Value |
|--------------|-------|
| **Method**   | `POST` |
| **URL**      | `https://be-vayuxi-chi.vercel.app/api/v1/site/69d00c7a33e8b43a08318873/rate/upload-csv` |
| **Query Param** | `type=mechanical_work` |
| **Payload**  | Multipart form — file key: `file`, filename: `sample mech rate .xlsx` |
| **Error Type** | `DioExceptionType.badResponse` |
| **HTTP Status** | `504` |
| **Server Message** | `FUNCTION_INVOCATION_TIMEOUT` |
| **Vercel Instance** | `bom1::zvc6j-1775242392362-3bb21a4d2b36` |
| **Queue Action** | ✅ Saved to offline queue for retry |

---

## API Call 2 — Manpower Flexible Upload

| Field        | Value |
|--------------|-------|
| **Method**   | `POST` |
| **URL**      | `https://be-vayuxi-chi.vercel.app/api/v1/manpower/flexible-upload` |
| **Query Param** | `type=mechanical_work` |
| **Payload**  | Not specified in logs |
| **Error Type** | `DioExceptionType.badResponse` |
| **HTTP Status** | `504` |
| **Server Message** | `An error occurred with your deployment` |
| **Error Body** | `{error: {code: 504, message: An error occurred with your deployment}}` |
| **Queue Action** | ❌ Not queued (server/client error classification) |

---

## Root Cause

Both failures share the same root cause: **Vercel serverless function timeout**.

- Vercel's default max execution time for serverless functions is **10 seconds** (Hobby) or **60 seconds** (Pro).
- Processing and uploading an `.xlsx` file (especially if parsing, DB writes, or external service calls are involved) likely exceeds this limit.
- The `bom1` region (Mumbai) instance `zvc6j` timed out on both requests.

---

## Issues Identified

1. **Timeout on file/CSV processing** — The backend function takes too long to parse and process the uploaded `.xlsx`, hitting Vercel's execution limit.
2. **Inconsistent queue behavior** — Call 1 was queued for retry; Call 2 was **not** queued due to it being classified as a server/client error. This may cause data loss on retry flows.
3. **No partial/async response** — The backend doesn't return a job ID or 202 Accepted response, so the client has no way to poll for status.

---

## Recommended Fixes

| Fix | Description |
|-----|-------------|
| **Background job queue** | Offload CSV processing to a background worker (e.g., BullMQ, Inngest, or Vercel's `waitUntil`) so the HTTP response returns immediately |
| **Increase timeout (Pro plan)** | Upgrade Vercel plan and set `maxDuration` in `vercel.json` for the affected routes |
| **Chunked/streaming upload** | Stream the file upload and process rows incrementally instead of loading the full sheet in memory |
| **Return 202 + polling** | Return `{ jobId }` immediately and let the client poll `/jobs/:id/status` |
| **Fix queue logic** | Ensure 504 errors on both endpoints are queued for offline retry consistently |