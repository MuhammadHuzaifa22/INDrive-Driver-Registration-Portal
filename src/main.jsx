import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './layout'
import Home from './Pages/Home'
import Login from './Pages/Login'

const router = createBrowserRouter([
    {
      path:'',
      element:<Layout/>,
      children:[
        {
          path:'/',
          element:<Login/>
        },
        {
          path:"/home",
          element:<Home/>
        }
      ]
    }
])


createRoot(document.getElementById('root')).render(
<RouterProvider router={router}>
</RouterProvider>  
)
