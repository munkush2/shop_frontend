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
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import "primereact/resources/themes/lara-light-green/theme.css";
        
const queryClient = new QueryClient()

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <PrimeReactProvider>
          <MyAppRouter />
        </PrimeReactProvider>
      </QueryClientProvider>
    </>  
  );
}

export default App;
