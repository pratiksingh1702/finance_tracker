import React from 'react'
import { cn } from '@/utils/cn'
import styles from './Table.module.css'

const Table = ({ children, className, ...props }) => {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

const TableHeader = ({ children, className, ...props }) => (
  <thead className={cn('[&_tr]:border-b bg-slate-50/50', className)} {...props}>
    {children}
  </thead>
)

const TableBody = ({ children, className, ...props }) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props}>
    {children}
  </tbody>
)

const TableFooter = ({ children, className, ...props }) => (
  <tfoot
    className={cn('border-t bg-slate-100/50 font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  >
    {children}
  </tfoot>
)

const TableRow = ({ children, className, ...props }) => (
  <tr
    className={cn(
      'border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100',
      className
    )}
    {...props}
  >
    {children}
  </tr>
)

const TableHead = ({ children, className, ...props }) => (
  <th
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  >
    {children}
  </th>
)

const TableCell = ({ children, className, ...props }) => (
  <td
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  >
    {children}
  </td>
)

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
}
