import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardThunk } from '@/features/analytics/analyticsThunks'
import { fetchTransactionsThunk } from '@/features/finance/financeThunks'
import SummaryCard from '@/components/charts/SummaryCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table/Table'
import Badge from '@/components/ui/Badge/Badge'
import { formatCurrency } from '@/utils/format-currency'
import { formatDate } from '@/utils/format-date'
import Spinner from '@/components/ui/Spinner/Spinner'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.constants'
import LineChart from '@/components/charts/LineChart'
import { cn } from '@/utils/cn'

const OverviewPage = () => {
  const dispatch = useDispatch()
  const { summary, recentActivity, loading } = useSelector((s) => s.analytics)

  useEffect(() => {
    dispatch(fetchDashboardThunk())
  }, [dispatch])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Financial Overview</h1>
        <p className="text-slate-500">Track your income, expenses, and savings at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Balance" 
          value={summary?.totalBalance || 0} 
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          variant="info"
          loading={loading}
        />
        <SummaryCard 
          title="Total Income" 
          value={summary?.totalIncome || 0} 
          icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          variant="success"
          loading={loading}
        />
        <SummaryCard 
          title="Total Expenses" 
          value={summary?.totalExpenses || 0} 
          icon="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          variant="danger"
          loading={loading}
        />
        <SummaryCard 
          title="Savings Rate" 
          value={`${summary?.savingsRate || 0}%`}
          icon="M12 4v16m8-8H4"
          variant="default"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cash Flow Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Link to={ROUTES.TRANSACTIONS.LIST} className="text-sm text-blue-600 hover:underline">View All</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-10"><Spinner /></div>
              ) : recentActivity?.length === 0 ? (
                <p className="text-center text-slate-500 py-10">No recent activity</p>
              ) : (
                recentActivity.map((t) => (
                  <div key={t._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      )}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.type === 'income' ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{t.title}</p>
                        <p className="text-xs text-slate-500">{formatDate(t.date)}</p>
                      </div>
                    </div>
                    <p className={cn(
                      'text-sm font-bold',
                      t.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    )}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OverviewPage
