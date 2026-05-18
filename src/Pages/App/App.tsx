import { BrowserRouter, useRoutes } from 'react-router-dom';
import Layout from '../../Components/Layout/Layout';
import Home from '../Home/Home';
import MyAccount from '../MyAccount/MyAccount';
import NotFound from '../NotFound/NotFound';
import SigIn from '../SigIn/SigIn';

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: '/my-account', element: <MyAccount /> },
        { path: '/sig-in', element: <SigIn /> },
        { path: '*', element: <NotFound /> },
      ]
    }
  ]);
  
  return routes;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* El Layout actúa como contenedor principal envolviendo el enrutador dinámico */}
   
        <AppRoutes />

    </BrowserRouter>
  );
}
