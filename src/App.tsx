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
import { AuthProvider } from './components/AuthContext';
import { FiltersProvider } from './components/FiltersContext';
        
const queryClient = new QueryClient()

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <PrimeReactProvider>
          <AuthProvider>
            <FiltersProvider>
              <MyAppRouter />
            </FiltersProvider>
          </AuthProvider>
        </PrimeReactProvider>
      </QueryClientProvider>
    </>  
  );
}

export default App;
