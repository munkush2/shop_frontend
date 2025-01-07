import React, { useState }  from 'react'; 
import { TabMenu } from 'primereact/tabmenu';
import { MenuItem } from 'primereact/menuitem';
import { Rating } from 'primereact/rating';
import { useParams } from 'react-router';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Iproduct } from '../Interfaces/Iproduct';
import { Skeleton } from 'primereact/skeleton';
import { Button } from 'primereact/button';

const Product = () => {
    const { id } = useParams(); 
    const [activeIndex, setActiveIndex] = useState(1);
   // console.log(id)

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

    const { data, isLoading, status, refetch } = useQuery({
        queryKey: [],
        queryFn: () => {
            const queryParams = [
             `id=${id}`
            ].filter(Boolean).join('&');
            
            return fetchProducts(queryParams);
        },
    });

    const items: MenuItem[] = [
        { label: 'About the product',},
        { label: 'performance',},
        { label: 'Reviews',},
        { label: 'Questions',}
    ];
    return (
        <>
            <div className=''>
                <div className="h-2rem h1">
                    <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                </div>
                {data?.products && data?.products.length > 0 && !isLoading ?(
                    data.products.map((product:Iproduct) => (
                        <div className='flex'>
                            <div>
                                <img src={product.image} alt="" />
                            </div>
                            <div>
                                <div >
                                    <p className='product-name'>{product.name}</p>
                                </div>
                                <div className="card flex justify-content-center" style={{ border: "none" }}>
                                    <Rating value={product.rating} readOnly disabled   cancel={false} />
                                </div>
                                <div>
                                    <div>
                                        <span className='product-price'>
                                            {product.price.toLocaleString('uk-UA')}<span className='currency'>₴</span>
                                        </span>
                                    </div>
                                    <div className='flex'>
                                        <div>
                                            <button>Купить</button>
                                        </div>
                                        <div>
                                            <button>Купить в кредит</button>
                                        </div>
                                    </div>    
                                </div>
                            </div>
                        </div>
                    ))
                    ) : ( isLoading ?
                            
                    <Skeleton className="fadein animation-duration-1000 w-full h-screen" />
                    :
                    <h3 className='flex margin-class'>Data not found</h3>
                    )
                }
            
            </div>
        </>
    )
}
export default Product;