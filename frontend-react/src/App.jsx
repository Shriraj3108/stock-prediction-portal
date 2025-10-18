import { useState } from 'react'
import './assets/css/style.css'
import Header from './components/Header'
import Register from './components/Register'
import Main from './components/Main'
import Footer from './components/Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import AuthProvider from './AuthProvider'
import PrivateRoute from './PrivateRoutes'
import PublicRoute from './PublicRoutes'
import Dashboard from './components/Dashboard'




function App() {

  return (
    <>
    <AuthProvider>
      <BrowserRouter>
      <Header/>
         <Routes>
           <Route path='/' element={<Main/>} />
           <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
          <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
           <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          </Routes>
         <Footer/>
      </BrowserRouter>
      </AuthProvider>

      
    </>
  )
}

export default App
