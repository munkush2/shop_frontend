import React from 'react';
import { Link, Outlet, NavLink } from 'react-router';

export default function Header() {
  return (
    <>
        <header>
            <nav>
                <NavLink to="/main" className='button-23'>Main</NavLink>
                <NavLink to="/register" className='button-23'>Register</NavLink>
                <NavLink to="/login" className='button-23'>Login</NavLink>
                <NavLink to="/shop" className='button-23'>Shop</NavLink>
            </nav>
        </header>
        <Outlet />
    </>    
  );
}
