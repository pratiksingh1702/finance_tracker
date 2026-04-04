import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchTransactionsThunk, fetchCategoriesThunk, deleteTransactionThunk } from '@/features/finance/financeThunks'
import { ROUTES } from '@/constants/routes.constants'
import { formatCurrency } from '@/utils/format-currency'
import { formatDate } from '@/utils/format-date'
import Button from '@/components/ui/Button/Button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table/Table'
import Badge from '@/components/ui/Badge/Badge'
import FilterForm from '@/components/forms/FilterForm'
import Spinner from '@/components/ui/Spinner/Spinner'
import { toast } from 'react-hot-toast'
import {cn} from '@/utils/cn'

const TransactionsPage = () => {
  const dispatch = useDispatch()
  const { transactions, loading, meta } = useSelector((s) => s.finance)

  useEffect(() => {
    dispatch(fetchTransactionsThunk())
    dispatch(fetchCategoriesThunk())
  }, [dispatch])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const result = await dispatch(deleteTransactionThunk(id))
      if (!result.error) {
        toast.success('Transaction deleted')
      } else {
        toast.error(result.payload || 'Failed to delete')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-500">View and manage your financial activity</p>
        </div>
        <Link to={ROUTES.TRANSACTIONS.CREATE}>
          <Button>+ New Transaction</Button>
        </Link>
      </div>

      <FilterForm />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No transactions found matching your criteria.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>{formatDate(t.date)}</TableCell>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell>{t.category?.name || 'Uncategorized'}</TableCell>
                  <TableCell>
                    <Badge variant={t.type === 'income' ? 'success' : 'danger'}>
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn(
                    'text-right font-semibold',
                    t.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Link to={ROUTES.TRANSACTIONS.DETAIL(t._id)}>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(t._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

export default TransactionsPage
