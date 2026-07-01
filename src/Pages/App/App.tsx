import { BrowserRouter, useRoutes } from 'react-router-dom';
import { UIProvider } from '../../Context/UIContext';
import Layout from '../../Components/Layout/Layout';
import Home from '../Home/Home';
import MyAccount from '../MyAccount/MyAccount';
import NotFound from '../NotFound/NotFound';
import SigIn from '../SigIn/SigIn';
import { DocumentosPage } from '../Documentos/Documentos';
import { HerramientasFinancieras } from '../Herramientas/HerramientasFinancieras';
import BOM  from '../BOM/BOM';

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: '/my-account', element: <MyAccount /> },
        { path: '/sig-in', element: <SigIn /> },
        { path: '/documentos', element: <DocumentosPage /> },
        { path: '*', element: <NotFound /> },
        { path: '/herramientas', element: <HerramientasFinancieras /> },
        { path: '/bom', element: <BOM /> },
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
