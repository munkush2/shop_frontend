import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { InewProduct } from "../Interfaces/InewProduct";
import axios from "axios";
import CONFIG from "../config/config";

const AddProduct = () => {
    const [brand, setBrand] = useState<string>('');
    const [ram, setRam] = useState<string>('');
    const [cpu, setCpu] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number | null>(null);
    const [image, setImage] = useState<string>('');
    const [rating, setRating] = useState<number | null>(null);

    const addProduct = useMutation({
        mutationFn: async (newProduct: InewProduct) => {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                console.error('No auth token found');
                throw new Error('No auth token found');
            }
            const headers = {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            };
            console.log('Sending data to API:', newProduct);
            const response = await axios.post(`${CONFIG.API_BASE_URL}/admin/addproduct`, newProduct, {headers});
            return response;
        },
        onSuccess: (data) => {
            setBrand('');
            setRam('');
            setCpu('');
            setName('');
            setPrice(null);
            setImage('');
            setRating(null);
        },
        onError: (error) => {
            throw new Error('Add product error', error);
        },
    });

    const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newProduct: InewProduct = {
            brand: brand,
            ram: `${ram} GB`,
            cpu: cpu,
            name: name,
            price: price ?? 0,
            image: image,
            rating: rating ?? 0,
        }
        addProduct.mutate(newProduct);
    }

    return (
        <>
            <div>
                <form onSubmit={handleAddProduct} method='POST'>
                    <div>
                        <div className="flex justify-content-center mb-4">
                            <FloatLabel>
                                <InputText id="brand" value={brand} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrand(e.target.value)} />
                                <label htmlFor="Brand">Brand</label>
                            </FloatLabel>
                        </div>
                        <div className="flex justify-content-center mb-4">
                            <FloatLabel>
                                <InputText id="ram" value={ram} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { const numericValue = e.target.value.replace(/\D/g, ''); setRam(numericValue); }}/>
                                <label htmlFor="ram">Ram</label>
                            </FloatLabel>
                        </div>
                        <div className="flex justify-content-center mb-4">
                            <FloatLabel>
                                <InputText id="cpu" value={cpu} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCpu(e.target.value)} />
                                <label htmlFor="cpu">Cpu</label>
                            </FloatLabel>
                        </div>
                        <div className="flex justify-content-center mb-4">
                        <FloatLabel>
                            <InputTextarea autoResize id="name"  value={name} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setName(e.target.value)} rows={1} cols={20} />
                            <label htmlFor="name">Name</label>
                        </FloatLabel>
                        </div>
                        <div className="flex justify-content-center mb-4">
                            <FloatLabel>
                                <InputNumber id="price" variant="filled" value={price} onValueChange={(e: InputNumberValueChangeEvent) => setPrice(e.value ?? null)} mode="decimal" minFractionDigits={2} />
                                <label htmlFor="price">Price</label>
                            </FloatLabel>
                        </div>
                        <div className="flex justify-content-center mb-4">
                            <FloatLabel>
                                <InputText id="imageURL" value={image} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage(e.target.value)} />
                                <label htmlFor="image URL">Image URL</label>
                            </FloatLabel>
                        </div>
                        <div className="flex justify-content-center mb-4">
                            <FloatLabel>
                                <InputNumber id="rating" value={rating} onValueChange={(e: InputNumberValueChangeEvent) => setRating(e.value ?? null)} />
                                <label htmlFor="rating">Rating</label>
                            </FloatLabel>
                        </div>
                        <div className="flex justify-content-center mb-4">
                            <Button type="submit" label="Add product" severity="secondary" rounded />
                        </div>    
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddProduct