// types.ts
export interface Version {
  id: string;
  nombre: string;
}

export interface Tipo {
  id: string;
  nombre: string;
  versiones: Version[];
}

export interface Tracto {
  id: string;
  nombre: string;
  tipos: Tipo[];
}

