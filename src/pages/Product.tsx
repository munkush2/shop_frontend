import { Rating } from 'primereact/rating';
import { useParams } from 'react-router';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Iproduct } from '../Interfaces/Iproduct';
import { Skeleton } from 'primereact/skeleton';
import { TabView, TabPanel } from 'primereact/tabview';
import CONFIG from '../config/config';

const Product = () => {
    const { id } = useParams(); 

    const fetchProducts = async (query:string | null) => {
        let config = {
            headers: {
            Authorization: 'Bearer ' + localStorage.getItem('authToken'),
            }
        }
        const response = await axios.get(`${CONFIG.API_BASE_URL}/shop?`+ query, config).catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }

        }).then(function(response) {
            return response;
        });
        return response?.data.data;
    };

    const { data, isLoading } = useQuery({
        queryKey: ['product'],
        queryFn: () => {
            const queryParams = [
                `id=${id}`
            ].filter(Boolean).join('&');
            return fetchProducts(queryParams);
        },
    });

    return (
        <>
            <div className='buy-container'>
                <TabView>
                    <TabPanel header='About product'>
                        <div>
                            {data?.products && data?.products.length > 0 && !isLoading ?(
                                data.products.map((product:Iproduct) => (
                                    <div className='flex' key={id}>
                                        <div>
                                            <img src={product.image}/>
                                        </div>
                                        <div>
                                            <div >
                                                <p className='buy-name'>{product.name}</p>
                                            </div>
                                            <div className="card flex justify-content-center" style={{ border: "none" }}>
                                                <Rating value={product.rating} readOnly disabled   cancel={false} />
                                            </div>
                                            <div className='flex mt-5'>
                                                <div>
                                                    <span className='buy-price'>
                                                        {product.price.toLocaleString('uk-UA')}<span className='currency'>₴</span>
                                                    </span>
                                                </div>
                                                <div className='flex'>
                                                    <div className='product-btn'>
                                                        <button className='btn btn-success buy'>Купить</button>
                                                    </div>
                                                    <div className='product-btn'>
                                                        <button className='btn btn-outline-success buy'>Купить в кредит</button>
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
                            )}
                        </div>
                    </TabPanel>
                    <TabPanel header="Property">
                        {data?.products && data?.products.length > 0 && !isLoading ? (
                            data.products.map((product: Iproduct) => (
                            <div key={product.id}>
                                <div>
                                    <p className="buy-name pe-none">{product.name}</p>
                                </div>
                                <div>
                                    <div>
                                        <label className='property'>Производитель</label>
                                        <span className="property">{product.brand.toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <label className='property'>Процесор</label>
                                        <span className='property'>{product.cpu}</span>
                                    </div>
                                    <div>
                                        <label className='property'>Объем оперативной памяти</label>
                                        <span className='property'>{product.ram}</span>
                                    </div>
                                </div>
                            </div>
                            ))
                        ) : isLoading ? (
                            <Skeleton className="fadein animation-duration-1000 w-full h-screen" />
                        ) : (
                            <h3 className="flex margin-class">Data not found</h3>
                        )}
                    </TabPanel>
                    <TabPanel header="Reviews"></TabPanel>
                    <TabPanel header="Questions"></TabPanel>
                </TabView>
            </div>    
        </>
    )
}
export default Product;