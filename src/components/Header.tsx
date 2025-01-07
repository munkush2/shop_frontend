import React from 'react';
import { Link, Outlet, NavLink } from 'react-router';
import { useAuth } from './AuthContext';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const authStatus = localStorage.getItem('authStatus');
  console.log(authStatus)

  return (
    <>
        <header>
            <nav>
              {isAuthenticated && authStatus === 'admin' && (
                <NavLink to="/admin" className='button-23'>Admin</NavLink>
              )}

              <NavLink to="/main" className='button-23'>Main</NavLink>
              <NavLink to="/shop" className='button-23'>Shop</NavLink>

              {!isAuthenticated ? (
                  <>
                    <NavLink to="/register" className='button-23'>Register</NavLink>
                    <NavLink to="/login" className='button-23'>Login</NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/main" className='button-23' onClick={logout}>Logout</NavLink>
                  </> 
                )
              } 
            </nav>
        </header>
        <Outlet />
    </>    
  );
}