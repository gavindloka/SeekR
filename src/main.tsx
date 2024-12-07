import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import LoginPage from './views/LoginPage.tsx'
import RegisterPage from './views/RegisterPage.tsx'
import React from 'react'
import HomePage from './views/HomePage.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import PostJobPage from './views/PostJobPage.tsx'
import BrowseJobPage from './views/BrowseJobPage.tsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<HomePage/>
  },
  {
    path:"/login",
    element:<LoginPage/>
  },
  {
    path:"/register",
    element:<RegisterPage/>
  },
  {
    path:"/post",
    element:<PostJobPage/>
  },
  {
    path:"/browse",
    element:<BrowseJobPage/>
  }
])



createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
      <Toaster/>
  </React.StrictMode>,
)
