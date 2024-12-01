import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import LoginPage from './views/LoginPage.tsx'
import RegisterPage from './views/RegisterPage.tsx'
import React from 'react'
import HomePage from './views/HomePage.tsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<HomePage/>
  },
  {
    path:"/login",
    element:<RegisterPage/>
  },
  {
    path:"/register",
    element:<RegisterPage/>
  }
])



createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
