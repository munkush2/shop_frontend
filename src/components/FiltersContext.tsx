import React, { createContext, useContext, useState } from 'react';
import { Ibrand } from '../Interfaces/Ibrand';
import { Icpu } from '../Interfaces/Icpu';
import { Iram } from '../Interfaces/Iram';
import { IFiltersContext } from '../Interfaces/IFiltersContext';



export const FiltersContext = createContext<IFiltersContext | undefined>(undefined);

export const FiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [brand, setBrand] = useState<Ibrand | null>(null);
    const [ram, setRam] = useState<Iram | null>(null);
    const [cpu, setCpu] = useState<Icpu | null>(null);
    const [price, setPrice] = useState<[number, number] | null>(null);
    const [sendPrice, setSendPrice] = useState<number>(0);

    return (
        <FiltersContext.Provider
        value={{
            brand,
            setBrand,
            ram,
            setRam,
            cpu,
            setCpu,
            price,
            setPrice,
            sendPrice,
            setSendPrice,
        }}>
        {children}
        </FiltersContext.Provider>
    );
};
