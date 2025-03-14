import Header from '../components/Header';
import MessageForm from '../pages/MessageForm';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Shop from '../pages/Shop';
import Product from '../pages/Product';
import AdminPanel from '../pages/AdminPanel';
import Filters from '../components/Filters';
import AddProduct from '../components/AddProduct';

export const routerList = [
  {
    path: "/",
    element: <Header />,
    children: [
      {
        path: "/main",
        element: <MessageForm />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/shop",
        element: <Shop />,
        children: [
          {
            path: "",
            element: <Filters />,
          }
        ]
      },
      {
        path: "/laptop/:id",
        element: <Product />,
      },
      {
        path: "/admin",
        element: <AdminPanel />,
        children: [
          {
            path: "",
            element: <AddProduct />,
          }
        ]
      },
    ]
  }
];