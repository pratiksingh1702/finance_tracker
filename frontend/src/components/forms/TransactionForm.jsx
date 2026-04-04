import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createTransactionThunk, updateTransactionThunk } from '@/features/finance/financeThunks'
import { ROUTES } from '@/constants/routes.constants'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import { toast } from 'react-hot-toast'

const TransactionForm = ({ initialData, isEdit = false }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { categories, submitting } = useSelector((s) => s.finance)

  const [formData, setFormData] = useState({
    title:    initialData?.title || '',
    amount:   initialData?.amount || '',
    type:     initialData?.type || 'expense',
    category: initialData?.category?._id || initialData?.category || '',
    date:     initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    note:     initialData?.note || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const data = {
      ...formData,
      amount: parseFloat(formData.amount),
    }

    let result
    if (isEdit) {
      result = await dispatch(updateTransactionThunk({ id: initialData._id, data }))
    } else {
      result = await dispatch(createTransactionThunk(data))
    }

    if (!result.error) {
      toast.success(`Transaction ${isEdit ? 'updated' : 'created'}`)
      navigate(ROUTES.TRANSACTIONS.LIST)
    } else {
      toast.error(result.payload || 'Operation failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Title"
          name="title"
          placeholder="Rent, Grocery, Salary..."
          required
          value={formData.title}
          onChange={handleChange}
        />
        
        <Input
          label="Amount"
          name="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
          value={formData.amount}
          onChange={handleChange}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Type</label>
          <select
            name="type"
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Category</label>
          <select
            name="category"
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <Input
          label="Date"
          name="date"
          type="date"
          required
          value={formData.date}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Notes (Optional)</label>
        <textarea
          name="note"
          rows={3}
          className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          placeholder="Add any additional details..."
          value={formData.note}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" loading={submitting} className="flex-1">
          {isEdit ? 'Update Transaction' : 'Create Transaction'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1"
          onClick={() => navigate(ROUTES.TRANSACTIONS.LIST)}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default TransactionForm
