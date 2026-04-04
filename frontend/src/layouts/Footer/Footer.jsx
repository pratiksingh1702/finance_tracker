import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Finance Dashboard. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
