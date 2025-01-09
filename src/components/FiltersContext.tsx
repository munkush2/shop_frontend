import React, { createContext, useContext, useState } from 'react';
import { Ibrand } from '../Interfaces/Ibrand';
import { Icpu } from '../Interfaces/Icpu';
import { Iram } from '../Interfaces/Iram';

interface IFiltersContext {
    brand: Ibrand | null;
    setBrand: React.Dispatch<React.SetStateAction<Ibrand | null>>;
    ram: Iram | null;
    setRam: React.Dispatch<React.SetStateAction<Iram | null>>;
    cpu: Icpu | null;
    setCpu: React.Dispatch<React.SetStateAction<Icpu | null>>;
    price: [number, number] | null;
    setPrice: React.Dispatch<React.SetStateAction<[number, number] | null>>;
    sendPrice: number;
    setSendPrice: React.Dispatch<React.SetStateAction<number>>;
}

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
