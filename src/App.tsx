import React from 'react';
import './App.css';
import  { MyAppRouter }  from './routes';
import './index.css'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MyAppRouter />
      </QueryClientProvider>
    </>  
  );
}

export default App;
