import { BrowserRouter, useRoutes } from 'react-router-dom';
import Layout from '../../Components/Layout/Layout';
import Home from '../Home/Home';
import MyAccount from '../MyAccount/MyAccount';
import NotFound from '../NotFound/NotFound';
import SigIn from '../SigIn/SigIn';

const AppRoutes = () => {
  // Las rutas ahora solo apuntan al componente específico de la página
  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/my-account', element: <MyAccount /> },
    { path: '/sig-in', element: <SigIn /> },
    { path: '*', element: <NotFound /> },
  ]);
  
  return routes;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* El Layout actúa como contenedor principal envolviendo el enrutador dinámico */}
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  );
}
