import { ReactNode } from "react";
import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";
import SideMenu from "../SideMenu/SideMenu";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Menú Lateral */}
      <SideMenu />

      {/* Área Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra Superior */}
        <Navbar />

        {/* Contenido Dinámico de la Página (Ej. Home) */}
        <main className="flex-1 overflow-y-auto p-6">
            {children}
        </main>
      </div>
    </div>
  );
}
