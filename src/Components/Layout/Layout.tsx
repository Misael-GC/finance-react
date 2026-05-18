
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import SideMenu from "../SideMenu/SideMenu";
import Footer from "../Footer/Footer";


export default function Layout() {
  //usar context y provider para manejar el estado global de la app (ej. user info, theme, etc.) [8] --- IGNORE ---
  // Inicializamos en true para que en laptops inicie abierto por defecto
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  // Función para alternar el estado
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-100 overflow-hidden"> 
      {
        isMenuOpen && (
          <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
        )}
      {/* Menú Lateral */}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Área Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra Superior */}
        <Navbar onToggleMenu={toggleMenu}/>

        {/* Contenido Dinámico de la Página (Ej. Home) */}
        <main className="flex-1 overflow-y-auto p- h-screen6">
            <Outlet />
            <Footer />
        </main>
      </div>
    </div>
  );
}
