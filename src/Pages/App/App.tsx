import { BrowserRouter, useRoutes } from 'react-router-dom';
import { UIProvider } from '../../Context/UIContext';
import Layout from '../../Components/Layout/Layout';
import Home from '../Home/Home';
import LocalMarket from '../LocalMarket/LocalMarket';
import NotFound from '../NotFound/NotFound';
import GlobalMarket from '../GlobalMarket/GlobalMarket';

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: '/local', element: <LocalMarket /> },
        { path: '/macro', element: <GlobalMarket /> },
        { path: '*', element: <NotFound /> },
      ]
    }
  ]);
  
  return routes;
}

export default function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <AppRoutes />
      </UIProvider>

    </BrowserRouter>
  );
}
