import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Iproduct } from '../Interfaces/Iproduct';
import '../components/Shop.css';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'primereact/dropdown';
import { Ibrand } from '../Interfaces/Ibrand';
import { Icpu } from '../Interfaces/Icpu';
import { Iram } from '../Interfaces/Iram';
import { Rating } from "primereact/rating";
import { Slider, SliderChangeEvent } from "primereact/slider";


const MinPrice = 1 
const MaxPrice = 300000

function Shop()  {
    const [brand, setBrand] = useState<Ibrand | null>(null);
    const [ram, setRam] = useState<Iram | null>(null);
    const [cpu, setCpu] = useState<Icpu | null>(null);
    const [price, setPrice] = useState<[number, number]>([MinPrice, MaxPrice]);

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
    }

    const { data, isLoading, status, refetch } = useQuery({
        queryKey: ['product', brand, ram, cpu],
        queryFn: () => {
            const queryParams = [
              brand?.title ? `brand=${brand.title}` : '',
              ram?.title ? `ram=${ram.title}` : '',
              cpu?.title ? `cpu=${cpu.title}` : '',
              `price_min=${price[0]}`,
              `price_max=${price[1]}`,
            ].filter(Boolean).join('&');
            
            return fetchProducts(queryParams);
        },
    });
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    const brands:Ibrand[] = [
        {'title': 'acer'},
        {'title': 'asus'},
        {'title': 'apple'},
        {'title': 'msi'},
    ]

    const cpus:Icpu[] = [
        {'title': 'Intel Core i5'},
        {'title': 'Intel Core i7'},
        {'title': 'M1'},
        {'title': 'M2'},
    ]

    const rams:Iram[] = [
        {'title': '8 GB'},
        {'title': '16 GB'},
        {'title': '32 GB'},
        {'title': '64 GB'},
    ]

    return (
        <>  
            <div>
                <h1 className='ms-4'>Laptop</h1> 
            </div>
            <div className='catalog'>gty
                <ul className='catalog-grid'>
                    <ul className='catalog-filters'>
                        <li className='catalog-filter'>
                            <Dropdown value={brand} onChange={(e) => setBrand(e.value)} options={brands} optionLabel="title" 
                                placeholder="Select a brand" className="w-full md:w-14rem" />
                        </li>    
                        <li className='catalog-filter'>
                            <Dropdown value={ram} onChange={(e) => setRam(e.value)} options={rams} optionLabel="title" 
                                placeholder="RAM capacity" className="w-full md:w-14rem" />
                        </li>    
                        <li className='catalog-filter'>
                            <Dropdown value={cpu} onChange={(e) => setCpu(e.value)} options={cpus} optionLabel="title" 
                                placeholder="CPU" className="w-full md:w-14rem" />
                        </li>
                        <p>Selected range: {price[0]} - {price[1]}</p>  
                        <div className="card flex justify-content-center">
                            <Slider value={price} onChange={(e: SliderChangeEvent) => setPrice(e.value as [number, number])} className="w-14rem" 
                                min={MinPrice} max={MaxPrice} step={100} range />
                        </div>
                    </ul>
                    {data?.products && data?.products.length > 0 ?(
                        data.products.map((product:Iproduct) => (
                            <li key={product.id} className='product'>
                                <div className='test'>
                                    <div className='image'>
                                        <img src={product.image} alt="" className='image-product' />
                                    </div>
                                    <div >
                                        <span className='product-name'>{product.name}</span>
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
                                        <button className='buy-btn' onClick={() => refetch()}>Купить</button>
                                    </div>
                                </div>    
                            </li>
                    ))
                    ) : (
                    <div>
                        Product not found
                    </div>
                    )} 
                </ul>
            </div>
        </>
    )
}

export default Shop;