export const TRANSACTION_TYPES = [
  { value: 'income',  label: 'Income',  color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { value: 'expense', label: 'Expense', color: 'text-rose-600',    bg: 'bg-rose-50'    },
]

export const TRANSACTION_STATUSES = [
  { value: 'completed',  label: 'Completed',  color: 'bg-emerald-100 text-emerald-700' },
  { value: 'pending',    label: 'Pending',    color: 'bg-amber-100   text-amber-700'   },
  { value: 'cancelled',  label: 'Cancelled',  color: 'bg-slate-100   text-slate-600'   },
]

export const TYPE_META = {
  income:  { label: 'Income',  sign: '+', color: 'text-emerald-600', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
  expense: { label: 'Expense', sign: '-', color: 'text-rose-600',    bg: 'bg-rose-50',     border: 'border-rose-200'    },
}