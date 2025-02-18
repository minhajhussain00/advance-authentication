import React, { useEffect, useState } from 'react'
import FloatingShape from "./components/FloatingShape"
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import Home from './pages/Home'
import LoadingSpinner from './components/LoadingSpinner'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
}
function App() {
    const {isCheckingAuth,checkAuth,isAuthenticated,user} = useAuthStore()
    useEffect(() => {
      checkAuth();
    }, [checkAuth]);
  
    if(isCheckingAuth){
      return <LoadingSpinner/>
    }
    console.log("isAuthenticated",isAuthenticated)
    console.log("user",user)
  return (
    <>
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
    <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
      <Routes>
         <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
         <Route path='/signup' element={<RedirectAuthenticatedUser><Signup/></RedirectAuthenticatedUser>}/>
         <Route path='/login' element={<RedirectAuthenticatedUser><Login/></RedirectAuthenticatedUser>}/>
         <Route path='/verify' element={<VerifyEmail/>}/>
         <Route path='/forgot-password' element={<RedirectAuthenticatedUser><ForgotPassword/></RedirectAuthenticatedUser>}/>
         <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser><ResetPassword/></RedirectAuthenticatedUser>} />

      </Routes>
      <Toaster/>
      </div>
      </>
  )
}

export default App
