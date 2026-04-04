import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSelected } from '@/features/finance/financeSlice'
import TransactionForm from '@/components/forms/TransactionForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card'
import Spinner from '@/components/ui/Spinner/Spinner'
import financeService from '@/services/finance.service'

const TransactionDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { selected, loading } = useSelector((s) => s.finance)
  const [localLoading, setLocalLoading] = React.useState(false)

  useEffect(() => {
    const fetchDetail = async () => {
      setLocalLoading(true)
      try {
        const { data } = await financeService.getTransaction(id)
        dispatch(setSelected(data.data))
      } catch (err) {
        console.error(err)
      } finally {
        setLocalLoading(false)
      }
    }
    fetchDetail()
  }, [id, dispatch])

  if (localLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!selected) {
    return (
      <div className="text-center py-20 text-slate-500">
        Transaction not found.
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Transaction</h1>
        <p className="text-slate-500">Update transaction information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionForm initialData={selected} isEdit />
        </CardContent>
      </Card>
    </div>
  )
}

export default TransactionDetailPage
