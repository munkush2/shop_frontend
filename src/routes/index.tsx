import { createBrowserRouter, RouterProvider } from 'react-router';
import { routerList } from './routes';

export const MyAppRouter = () => (
    <RouterProvider router={createBrowserRouter(routerList)} />
)