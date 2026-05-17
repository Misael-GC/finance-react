import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function Card({
  title,
  subtitle,
  image,
  imageAlt = 'Card image',
  children,
  onClick,
}: CardProps) {
  
  // Determinamos si la tarjeta es interactiva (clicable) para aplicar estilos de hover
  const isClickable = typeof onClick === 'function';

  return (
    <div
      onClick={onClick}
      className={`
        group overflow-hidden rounded-2xl border bg-slate-800 border-slate-700/60 text-slate-100 shadow-lg
        transition-all duration-300 ease-out
        ${isClickable ? 'cursor-pointer hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:shadow-xl' : ''}
      `}
    >
      {/* 1. Header con Imagen (Opcional) */}
      {image && (
        <div className="relative overflow-hidden aspect-video w-full bg-slate-900">
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {/* Capa de degradado sutil sobre la imagen */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
        </div>
      )}

      {/* 2. Cuerpo de la Tarjeta */}
      <div className="p-6">
        {subtitle && (
          <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase block mb-1">
            {subtitle}
          </span>
        )}
        
        {title && (
          <h3 className="text-xl font-bold text-white tracking-tight leading-snug mb-2 group-hover:text-cyan-300 transition-colors duration-200">
            {title}
          </h3>
        )}

        {/* 3. Contenido Dinámico inyectado */}
        {children && (
          <div className="text-sm text-slate-400 font-normal leading-relaxed">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}