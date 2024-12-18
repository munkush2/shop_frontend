import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Iproduct } from '../Interfaces/Iproduct';
import '../components/Shop.css';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { number } from 'yup';
import { Link, Outlet, NavLink } from 'react-router';

const fetchProducts = async () => {
    const response = await axios.get("http://localhost:8000/api/shop");
    return response.data;
}

const Shop = () => {

    const { data, isLoading, status } = useQuery({
        queryKey: ['product'],
        queryFn: fetchProducts,
    });
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleSort = () => {
        const sortedLaptops = data.sort((a: Iproduct, b: Iproduct) => a.price - b.price);
        console.log(sortedLaptops)
    };

    return (
        <>
            <div className='catalog'>
                <h1>Laptop</h1>
                <select onClick={handleSort}>
                    <option value="">qwe</option>
                    <option  value="sort=chip">От дешевых к дорогим</option>
                    <option value="">От дорогих к дешевым</option>  
                </select>
                <nav>
                    <NavLink to="/shop/sort=chip">Перейти к сортировке от дешевых к дорогим</NavLink>
                </nav>    
                <ul className='catalog-grid'>
                    {data.map((product:Iproduct) => (
                        <li key={product.id} className='product'>
                            <div className='test'>
                                <div className='image'>
                                    <img src={product.image} alt="" className='image-product' />
                                </div>
                                <div >
                                    <span className='product-name'>{product.name}</span>
                                </div>
                                <div>
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <svg className="star-rating" xmlns="http://www.w3.org/2000/svg" key={`${product.id}-${value}`}>
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                                                fill={value <= product.rating ? 'gold' : 'lightgray'}
                                            />
                                        </svg>
                                    ))}
                                </div>
                                <div className='delivery'>
                                    <span>Готово к отправке</span>
                                </div>
                                <div className='price'>
                                    <span className='product-price'>
                                        {product.price.toLocaleString('uk-UA')}<span className='currency'>₴</span>
                                    </span>
                                    <button className='buy-btn'>Купить</button>
                                </div>
                            </div>    
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Shop;