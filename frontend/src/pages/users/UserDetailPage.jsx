import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserByIdThunk, updateUserRoleThunk } from '@/features/user/userThunks'
import { ROLES, ROLE_LABELS } from '@/constants/roles.constants'
import { ROUTES } from '@/constants/routes.constants'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card'
import Button from '@/components/ui/Button/Button'
import Spinner from '@/components/ui/Spinner/Spinner'
import { toast } from 'react-hot-toast'

const UserDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { selected, loading } = useSelector((s) => s.user)
  const [role, setRole] = useState('')

  useEffect(() => {
    dispatch(fetchUserByIdThunk(id))
  }, [id, dispatch])

  useEffect(() => {
    if (selected) setRole(selected.role)
  }, [selected])

  const handleUpdateRole = async () => {
    const result = await dispatch(updateUserRoleThunk({ id, role }))
    if (!result.error) {
      toast.success('User role updated')
      navigate(ROUTES.USERS.LIST)
    } else {
      toast.error(result.payload || 'Update failed')
    }
  }

  if (loading && !selected) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  if (!selected) return <div className="text-center py-20">User not found</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Details</h1>
        <p className="text-slate-500">Modify user role and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Name</p>
              <p className="text-lg font-semibold">{selected.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Email</p>
              <p className="text-lg font-semibold">{selected.email}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Role</label>
            <select
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value={ROLES.USER}>{ROLE_LABELS[ROLES.USER]}</option>
              <option value={ROLES.ADMIN}>{ROLE_LABELS[ROLES.ADMIN]}</option>
            </select>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleUpdateRole} className="flex-1">Update Role</Button>
            <Button variant="outline" onClick={() => navigate(ROUTES.USERS.LIST)} className="flex-1">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserDetailPage
