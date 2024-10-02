import React from 'react'
import { Link } from 'react-router-dom'
import { FaExclamationTriangle } from 'react-icons/fa'
/// error page for bad links/pages
function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <FaExclamationTriangle className="text-green-400 text-6xl" />
      <h3 className="text-6xl mt-4">404 Page Not Found</h3>
    </div>
  )
}

export default NotFound
