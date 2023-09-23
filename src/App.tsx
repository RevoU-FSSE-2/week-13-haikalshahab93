import { LoginPage, RegisterPage, DashboardPage, NotFoundPage } from './pages'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LoginPage />
    },
    {
      path: '/register',
      element: <RegisterPage />
    },
    {
      path: '/dashboard',
      element: <DashboardPage />
    },
    {
      path: '*',
      element: <NotFoundPage />
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
