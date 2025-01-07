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
import { Skeleton } from 'primereact/skeleton';
import { Link } from 'react-router';


const MinPrice = 1 
const MaxPrice = 500000

function Shop()  {
    const [brand, setBrand] = useState<Ibrand | null>(null);
    const [ram, setRam] = useState<Iram | null>(null);
    const [cpu, setCpu] = useState<Icpu | null>(null);
    //const [price, setPrice] = useState<[number, number]>([0, 0]);
    const [price, setPrice] = useState<[number, number] | null>(null);
    const [sendPrice, setSendPrice] = useState<number>(0);

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
                //const { price_min, price_max } = data.price_range;
                setPrice([min, max]); // Устанавливаем диапазон цен
            }
        });
    }, []);

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
    const resetFilters = () => {
        setBrand(null);
        setRam(null); 
        setCpu(null);
        setSendPrice(0);
        //console.log(data.price_range.price_min, data.price_range.price_max)
        //setPrice([data.price_range.price_min, data.price_range.price_max])
    };

    return (
        <> 
            <div>
                <h1 className='ms-4'>Laptop</h1> 
                
            </div>
            <div className='catalog'>gty
                <ul className='catalog-grid'>
                    <div className=''>
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
                            <p>Selected range:  {price ? `${price[0]} - ${price[1]}` : 'No range selected'}</p>  
                            <div className="card flex justify-content-center">
                                <Slider value={price || 0} onChange={(e: SliderChangeEvent) => {
                                    const [newMin, newMax] = e.value as [number, number];
                                    if (newMax < newMin) {
                                        setPrice([newMax, newMin]);
                                    } else {
                                        setPrice([newMin, newMax]);
                                    }
                                    }}
                                    onSlideEnd={() => setSendPrice(sendPrice + 1)} className="w-14rem" 
                                    min={MinPrice} max={MaxPrice} step={100} range />
                            </div>
                        </ul>
                        <div>
                            <button onClick={resetFilters} className="btn btn-secondary mt-3 ml-5">Reset Filters</button>
                        </div>
                    </div>
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
                                        <button className='buy-btn' onClick={() => refetch()}>Купить</button>
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