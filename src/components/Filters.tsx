import { Slider, SliderChangeEvent } from "primereact/slider";
import { Skeleton } from 'primereact/skeleton';
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Ibrand } from '../Interfaces/Ibrand';
import { Icpu } from '../Interfaces/Icpu';
import { Iram } from '../Interfaces/Iram';
import { useFilters } from '../actions/useFilters';
import { useEffect, useState } from "react";
import CONFIG from "../config/config";

const Filters = () => { 
    const { brand, setBrand, ram, setRam, cpu, setCpu, price, setPrice, sendPrice, setSendPrice } = useFilters();
    const [brands, setBrands] = useState<Ibrand[]>([])
    const [cpus, setCpus] = useState<Icpu[]>([])
    const [rams, setRams] = useState<Iram[]>([])
    const MinPrice = 10000 
    const MaxPrice = 300000

    const fetchFilters = async () => {
        let config = {
            headers: {
            Authorization: 'Bearer ' + localStorage.getItem('authToken'),
            }
        }
        const response = await axios.get(`${CONFIG.API_BASE_URL}/shop/filters`, config).catch(function (error) {
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

    const { data: filters, isLoading: filtersLoading } = useQuery({
        queryKey: ['filters'],
        queryFn: fetchFilters,
    });

    useEffect(() => {
        if (filters?.price_range) {
            const min = filters.price_range.price_min
            const max = filters.price_range.price_max
            setPrice([min, max]);
            setBrands(filters.brand)
            setCpus(filters.cpu)
            setRams(filters.ram)
        }
    }, [filters]);

    const resetFilters = () => {
        setBrand(null);
        setRam(null); 
        setCpu(null);
        setSendPrice(0);
    };

    return (
        <>
            <div>
                <ul className='catalog-filters'>
                {filtersLoading ? (
                    <Skeleton className="fadein animation-duration-1000 w-full h-screen" />
                ) : filters ? (
                    <>
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
                    </>
                ) : (
                    <h3 className="flex margin-class">Data not found</h3>
                )}
                    <div>Selected range: <p>{price ? `${price[0]} - ${price[1]}` : 'No range selected'}</p></div>  
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
                            min={MinPrice} max={MaxPrice} step={100} range 
                        />
                    </div>
                </ul>
                <div>
                    <button onClick={resetFilters} className="btn btn-secondary mt-3 ml-5">Reset Filters</button>
                </div>
            </div>
        </>
    )
}

export default Filters