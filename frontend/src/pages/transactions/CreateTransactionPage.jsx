import React from 'react'
import TransactionForm from '@/components/forms/TransactionForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card'

const CreateTransactionPage = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Transaction</h1>
        <p className="text-slate-500">Add a new income or expense to your record</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateTransactionPage
