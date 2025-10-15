import React, { Children } from 'react'
import Header from './Header'

export default function Layout({children}) {
  return (
    <div>
      <Header/>
      <main style={{padding:'1rem'}}>
        {children}
      </main>
    </div>
  )
}
