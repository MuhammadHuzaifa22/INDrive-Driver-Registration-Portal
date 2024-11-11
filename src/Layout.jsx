import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Components/Navbar'

const Layout = () => {
  return (
    <>
    <div>
        <Navbar/>
    </div>
    <Outlet/>
    </>
  )
}

export default Layout