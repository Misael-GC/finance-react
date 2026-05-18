
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import SideMenu from "../SideMenu/SideMenu";
import Footer from "../Footer/Footer";


export default function Layout() {
  return (
    <div className="flex md:flex-row h-screen bg-slate-100"> 
      {/* Menú Lateral */}
      <SideMenu />

      {/* Área Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra Superior */}
        <Navbar />

        {/* Contenido Dinámico de la Página (Ej. Home) */}
        <main className="flex-1 overflow-y-auto p- h-screen6">
            <Outlet />
            <Footer />
        </main>
      </div>
    </div>
  );
}
