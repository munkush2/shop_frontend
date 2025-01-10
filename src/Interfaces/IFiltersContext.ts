import { Ibrand } from "./Ibrand";
import { Icpu } from "./Icpu";
import { Iram } from "./Iram";

export interface IFiltersContext {
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