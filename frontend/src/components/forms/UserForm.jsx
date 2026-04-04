import React, { useState } from 'react'
import { ROLES, ROLE_LABELS } from '@/constants/roles.constants'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'

const UserForm = ({ initialData, onSubmit, onCancel, submitting }) => {
  const [formData, setFormData] = useState({
    name:  initialData?.name || '',
    email: initialData?.email || '',
    role:  initialData?.role || ROLES.USER,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        disabled={!!initialData}
      />
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Role</label>
        <select
          name="role"
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value={ROLES.USER}>{ROLE_LABELS[ROLES.USER]}</option>
          <option value={ROLES.ADMIN}>{ROLE_LABELS[ROLES.ADMIN]}</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={submitting} className="flex-1">
          {initialData ? 'Update User' : 'Create User'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default UserForm
