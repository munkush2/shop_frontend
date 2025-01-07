import React, { Children } from 'react';
import Header from '../components/Header';
import MessageForm from '../pages/MessageForm';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Shop from '../pages/Shop';
import Product from '../pages/Product';
import AdminPanel from '../pages/AdminPanel';

// Список маршрутов
export const routerList = [
  {
    path: "/",
    element: <Header />,  // Главный компонент Header
    children: [
      {
        path: "/main",
        element: <MessageForm />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/laptop/:id",
        element: <Product />
      },
      {
        path: "/admin",
        element: <AdminPanel />
      },
    ]
  }
];