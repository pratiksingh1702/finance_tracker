import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardThunk } from '@/features/analytics/analyticsThunks'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import LineChart from '@/components/charts/LineChart'
import SummaryCard from '@/components/charts/SummaryCard' 
import Spinner from '@/components/ui/Spinner/Spinner'

const AnalyticsPage = () => {
  const dispatch = useDispatch()
  const { summary, categoryBreakdown, loading, error } = useSelector((s) => s.analytics)

  useEffect(() => {
    dispatch(fetchDashboardThunk())
  }, [dispatch])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="p-4 bg-red-50 rounded-full">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900">Failed to load analytics</h3>
          <p className="text-slate-500 max-w-xs">{error}</p>
        </div>
        <button 
          onClick={() => dispatch(fetchDashboardThunk())}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Deep Analytics</h1>
        <p className="text-slate-500">Analyze your spending patterns and income trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Balance" 
          value={summary?.netBalance || 0} 
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {loading && !categoryBreakdown.length ? (
                <div className="h-full flex items-center justify-center"><Spinner /></div>
              ) : (
                <PieChart data={categoryBreakdown} />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <BarChart />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Income vs Expenses Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <LineChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AnalyticsPage
