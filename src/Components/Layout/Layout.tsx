
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useUI } from "../../Context/UIContext";
import Navbar from "../Navbar/Navbar";
import SideMenu from "../SideMenu/SideMenu";
import Footer from "../Footer/Footer";


export default function Layout() {

  const { isMenuOpen, toggleMenu } = useUI();
  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-100 overflow-hidden"> 
      {
        isMenuOpen && (
          <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => toggleMenu}
        />
        )}
      {/* Menú Lateral */}
      <SideMenu isOpen={isMenuOpen} onClose={() => toggleMenu()} />

      {/* Área Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra Superior */}
        <Navbar onToggleMenu={toggleMenu}/>

        {/* Contenido Dinámico de la Página (Ej. Home) */}
        <main className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex-1 p-4 md:p-6">
              <Outlet />
            </div>
            <Footer />
        </main>
      </div>
    </div>
  );
}
