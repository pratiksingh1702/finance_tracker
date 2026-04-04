import { createSelector } from '@reduxjs/toolkit'

const selectUserState = (state) => state.user

export const selectUsers = createSelector(selectUserState, (u) => u.users)
export const selectSelectedUser = createSelector(selectUserState, (u) => u.selected)
export const selectUserLoading = createSelector(selectUserState, (u) => u.loading)
export const selectUserMeta = createSelector(selectUserState, (u) => u.meta)
export const selectUserFilters = createSelector(selectUserState, (u) => u.filters)
