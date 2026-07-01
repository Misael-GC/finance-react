// src/Components/TaxonomyTree/TaxonomyTree.tsx
import React, { useState } from 'react';
import './TaxonomyTree.css';

// --- INTERFACES DE DOMINIO ---
export interface Cliente {
  id: string;
  nombre: string;
}

export interface Version {
  id: string;
  nombre: string;
  clientes?: Cliente[];
}

export interface Tipo {
  id: string;
  nombre: string;
  versiones: Version[];
}

export interface TractoData {
  id: string;
  nombre: string;
  tipos: Tipo[];
}

// --- PROPS DE COMPONENTES ---
interface TaxonomyNodeProps {
  label: string;
  levelLabel: string;
  isActive: boolean;
  onClickNode: () => void;
  showAddButton: boolean;
  onClickAdd: () => void;
  isGreenAdd?: boolean;
}

// 1. Componente Presentacional (Puro)
const TaxonomyNode: React.FC<TaxonomyNodeProps> = React.memo(({ 
  label, 
  levelLabel, 
  isActive, 
  onClickNode, 
  showAddButton, 
  onClickAdd, 
  isGreenAdd = false 
}) => (
  <div className={`taxonomy-node-wrapper ${isActive ? 'node-active' : ''}`}>
    <span className="level-label">{levelLabel}</span>

    <div className="node-control-container">
      <div className="select-mimic" onClick={onClickNode}>
        <span className="icon-search">🔍</span>
        <span className="select-label-text">{label}</span>
        <span className="icon-arrow">▼</span>
      </div>

      {showAddButton && (
        <button 
          className={`add-button ${isGreenAdd ? 'green-add' : 'white-add'}`}
          onClick={(e) => {
            e.stopPropagation(); // Evita disparar el clic del nodo
            onClickAdd();
          }}
          title="Añadir nuevo registro"
        >
          +
        </button>
      )}
    </div>
  </div>
));

// 2. Contenedor Principal
interface TaxonomyTreeProps {
  tractoData: TractoData | null;
}

export const TaxonomyTree: React.FC<TaxonomyTreeProps> = ({ tractoData }) => {
  const [selectedTipoId, setSelectedTipoId] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  if (!tractoData) {
    return <div className="text-slate-400 p-4">Seleccione un tracto para visualizar la taxonomía...</div>;
  }

  // Búsqueda en tiempo constante O(N) para nodos activos
  const activeTipo = tractoData.tipos.find(t => t.id === selectedTipoId);
  const activeVersion = activeTipo?.versiones.find(v => v.id === selectedVersionId);

  return (
    <div className="taxonomy-tree-main-container">
      {/* NIVEL 1: Tracto Raíz */}
      <div className="tree-column">
        <TaxonomyNode 
          levelLabel="1. TRACTOS / PROYECTOS *"
          label={tractoData.nombre} 
          isActive={true} 
          onClickNode={() => {}}
          showAddButton={true}
          isGreenAdd={true}
          onClickAdd={() => console.log('Acción: Añadir Tracto')}
        />
      </div>

      {tractoData.tipos.length > 0 && <div className="tree-connector" />}

      {/* NIVEL 2: Tipos */}
      <div className="tree-column">
        {tractoData.tipos.map((tipo) => (
          <div className="node-branch-wrapper" key={tipo.id}>
            <TaxonomyNode 
              levelLabel="2. TIPOS *"
              label={tipo.nombre}
              isActive={selectedTipoId === tipo.id}
              onClickNode={() => {
                setSelectedTipoId(tipo.id);
                setSelectedVersionId(null); // Limpiar jerarquía inferior
              }}
              showAddButton={true}
              onClickAdd={() => console.log(`Acción: Añadir Tipo a ${tractoData.nombre}`)}
            />
            {selectedTipoId === tipo.id && tipo.versiones.length > 0 && (
              <div className="tree-connector nested" />
            )}
          </div>
        ))}
      </div>

      {/* NIVEL 3: Versiones */}
      {activeTipo && activeTipo.versiones.length > 0 && (
        <div className="tree-column">
          {activeTipo.versiones.map((version) => (
            <div className="node-branch-wrapper" key={version.id}>
              <TaxonomyNode 
                levelLabel="3. VERSIONES *"
                label={version.nombre}
                isActive={selectedVersionId === version.id}
                onClickNode={() => setSelectedVersionId(version.id)}
                showAddButton={true}
                onClickAdd={() => console.log(`Acción: Añadir Versión a ${activeTipo.nombre}`)}
              />
              {selectedVersionId === version.id && version.clientes && version.clientes.length > 0 && (
                  <div className="tree-connector nested" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* NIVEL 4: Clientes */}
      {activeVersion && activeVersion.clientes && activeVersion.clientes.length > 0 && (
        <div className="tree-column">
          {activeVersion.clientes.map((cliente) => (
            <div className="node-branch-wrapper" key={cliente.id}>
              <TaxonomyNode 
                levelLabel="4. CLIENTES *"
                label={cliente.nombre}
                isActive={false} 
                onClickNode={() => console.log(`Cliente seleccionado: ${cliente.id}`)}
                showAddButton={true}
                onClickAdd={() => console.log(`Acción: Añadir Cliente a ${activeVersion.nombre}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};