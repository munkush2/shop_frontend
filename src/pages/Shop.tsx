import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Iproduct } from '../Interfaces/Iproduct';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Rating } from "primereact/rating";
import { Skeleton } from 'primereact/skeleton';
import { Link, Outlet } from 'react-router';
import { useFilters } from '../actions/useFilters';

function Shop()  {
    const { brand, ram, cpu, price, setPrice, sendPrice } = useFilters();
    const fetchProducts = async (query:string | null) => {
        let config = {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('authToken'),
            }
        }
        const response = await axios.get("http://localhost:8000/api/shop?"+ query, config).catch(function (error) {
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            }
        }).then(function(response) {
            return response;
        });
        return response?.data;
    };

    const { data, isLoading } = useQuery({
        queryKey: ['product', brand, ram, cpu, sendPrice],
        queryFn: () => {
            const queryParams = [
              brand?.title ? `brand=${brand.title}` : '',
              ram?.title ? `ram=${ram.title}` : '',
              cpu?.title ? `cpu=${cpu.title}` : '',
              price ? `price_min=${price[0]}` : '',
              price ? `price_max=${price[1]}` : '',
            ].filter(Boolean).join('&');
            
            return fetchProducts(queryParams);
        },
    });

    useEffect(() => {
        fetchProducts(null).then((data) => {
            if (data?.price_range) {
                const min = data.price_range.price_min
                const max = data.price_range.price_max
                setPrice([min, max]);
            }
        });
    }, []);

    return (
        <> 
            <div>
                <h1 className='ms-4'>Laptop</h1> 
            </div>
            <div className='catalog'>
                <ul className='catalog-grid'>
                    <Outlet />
                    <div className='flex flex-wrap w-full '>
                        {data?.products && data?.products.length > 0 && !isLoading ?(
                            data.products.map((product:Iproduct) => (

                                <li key={product.id} className='product'>
                                    <div className='test'>
                                        <div className='image'>
                                            <img src={product.image} alt="" className='image-product' />
                                        </div>
                                        <div >
                                            <Link to={`/laptop/${product.id}`} className='product-name'>{product.name}</Link>
                                        </div>
                                        <div className="card flex justify-content-center" style={{ border: "none" }}>
                                            <Rating value={product.rating} readOnly disabled   cancel={false} />
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
                            ))
                        ) : ( isLoading ?
                                
                            <Skeleton className="fadein animation-duration-1000 w-full h-screen" />
                            :
                            <h3 className='flex margin-class'>Data not found</h3>
                        )} 
                    </div>
                </ul>
            </div>
        </>
    )
}
export default Shop;