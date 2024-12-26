import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Iuser } from "../Interfaces/Iuser";
import { useState } from "react";
import type { TableColumnsType, TableProps } from 'antd';
import { Button, Space, Table, Select } from 'antd';


type OnChange = NonNullable<TableProps<Iuser>['onChange']>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const AdminPanel = () => {
    const [filteredInfo, setFilteredInfo] = useState<Filters>({});
    const [sortedInfo, setSortedInfo] = useState<Sorts>({});
    
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
        queryKey: [],
        queryFn: () => {
            const queryParams = [
            ].filter(Boolean).join('&');
            
            return fetchUsers(queryParams);
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
            const response = await axios.post('http://localhost:8000/api/admin/users/updatestatus', updateStatusUser, {headers});
            return response.data;
        },
        onSuccess: (data) => {
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


    if (isLoading) {
        return <div>Loading...</div>
    }

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




    return (
        <>
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
        </>
    )
}
export default AdminPanel