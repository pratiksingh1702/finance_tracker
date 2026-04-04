import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, resetFilters } from '@/features/finance/financeSlice'
import { fetchTransactionsThunk } from '@/features/finance/financeThunks'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'

const FilterForm = () => {
  const dispatch = useDispatch()
  const { filters, categories } = useSelector((s) => s.finance)

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch(setFilters({ [name]: value }))
  }

  const handleApply = () => {
    dispatch(fetchTransactionsThunk())
  }

  const handleReset = () => {
    dispatch(resetFilters())
    dispatch(fetchTransactionsThunk())
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
      <Input
        placeholder="Search transactions..."
        name="search"
        value={filters.search}
        onChange={handleChange}
      />
      
      <select
        name="type"
        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        value={filters.type}
        onChange={handleChange}
      >
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        name="category"
        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        value={filters.category}
        onChange={handleChange}
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <div className="flex gap-2">
        <Button onClick={handleApply} className="flex-1">Apply</Button>
        <Button onClick={handleReset} variant="outline" className="flex-1">Reset</Button>
      </div>
    </div>
  )
}

export default FilterForm
