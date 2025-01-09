import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Iuser } from "../Interfaces/Iuser";
import { useState } from "react";
import type { TableColumnsType, TableProps } from 'antd';
import { Space, Table, Select } from 'antd';
import { useNavigate } from "react-router";
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import "/node_modules/primeflex/primeflex.css";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { InewProduct } from "../Interfaces/InewProduct";

type OnChange = NonNullable<TableProps<Iuser>['onChange']>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const AdminPanel = () => {
    const navigate = useNavigate();
    const [filteredInfo, setFilteredInfo] = useState<Filters>({});
    const [sortedInfo, setSortedInfo] = useState<Sorts>({});

    const [brand, setBrand] = useState<string>('');
    const [ram, setRam] = useState<string>('');
    const [cpu, setCpu] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number | null>(null);
    const [image, setImage] = useState<string>('');
    const [rating, setRating] = useState<number | null>(null);
    
    const fetchUsers = async (query:string | null) => {
        // console.log(localStorage)
        let config = {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('authToken'),
            }
        }
        const response = await axios.get("http://localhost:8000/api/admin/users"+ query, config).catch(function (error) {
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
        queryKey: ['user_status', localStorage],
        queryFn: () => {
            const queryParams = [
            ].filter(Boolean).join('&');
            
            return fetchUsers(queryParams);
        },
    });

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
          const response = await axios.post('http://localhost:8000/api/admin/addproduct', newProduct, {headers});
          return response;
        },
        onSuccess: (data) => {
          console.log('Registration successful:', data);
          //reset()
        },
        onError: (error) => {
          console.error('Registration failed:', error);
        },
    });
    
    const mutation = useMutation({
        mutationFn: async (updateStatusUser: {id: number, user_status: string }) => {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                console.error('No auth token found');
                throw new Error('No auth token found');
            }
            const headers = {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            };

            console.log('Sending data to API:', updateStatusUser);
            const response = await axios.post('http://localhost:8000/api/admin/users/status/update', updateStatusUser, {headers});
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.removeItem('authStatus');
            localStorage.setItem('authStatus', data.user_status);
            let authStatus = localStorage.getItem('authStatus')
            if(authStatus !== 'admin') {
                navigate("/shop")
            }
            console.log('Logination successful:', data);
        },
        onError: (error) => {
            console.error('Logination failed:', error);
        },
    });
   
    const handleStatusChange = (id: number, value: string) => {
        mutation.mutate({ id, user_status: value });
    };


    const handleChange: OnChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setFilteredInfo(filters);
        setSortedInfo(sorter as Sorts);
    };

    const clearFilters = () => {
        setFilteredInfo({});
    };
    
      const clearAll = () => {
        setFilteredInfo({});
        setSortedInfo({});
    };


  

    const columns: TableColumnsType<Iuser> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortOrder: sortedInfo.columnKey === 'id' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'User status',
            dataIndex: 'user_status',
            key: 'user_status',
            filters: [
              { text: 'admin', value: 'admin' },
              { text: 'user', value: 'user' },
            ],
            render: (text: string, record: Iuser) => (
                <Select
                  defaultValue={text} 
                  onChange={(value) => handleStatusChange(record.id , value)}
                >
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="user">User</Select.Option>
                </Select>
              ),
            filteredValue: filteredInfo.user_status || null,
            onFilter: (value, record) => record.user_status.includes(value as string),
            sorter: (a, b) => a.user_status.length - b.user_status.length,
            sortOrder: sortedInfo.columnKey === 'user_status' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
            sortOrder: sortedInfo.columnKey === 'email' ? sortedInfo.order : null,
            ellipsis: true,
        },
        { 
            title: 'Date', 
            dataIndex: 'created_at', 
            key: 'created_at' ,
            render: (text: string) => new Date(text).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })
        },
    ]
///fdsdffafsdasdfdsafsadassfadsd

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
            <TabView>
                <TabPanel header="Admin control">
                    <div>
                        <h1>ADMIN</h1>
                        <div>
                            <Space style={{ marginBottom: 16 }}>
                                <Button onClick={clearFilters}>Clear filters</Button>
                                <Button onClick={clearAll}>Clear filters and sorters</Button>
                            </Space>
                            <Table<Iuser>  columns={columns} dataSource={data} onChange={handleChange} rowKey="id" />
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Add product">
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
                </TabPanel>
            </TabView>     
        </>
    )
}
export default AdminPanel