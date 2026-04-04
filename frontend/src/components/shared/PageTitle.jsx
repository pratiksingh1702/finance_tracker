import React, { useEffect } from 'react'

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = `${title} | Finance Dashboard`
  }, [title])

  return null
}

export default PageTitle
