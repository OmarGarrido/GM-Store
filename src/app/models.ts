export interface Smartphone {
  marca: string;
  modelo: string;
  descripcion: string;
  procesador: string;
  camara: string;
  almacenamiento: string;
  precio: number;
  existencias: number;
  colores: string[];
  calificacion: number;
  url: string;
  idFirebase: string;
}
export interface Usuario {
  nombre: string;
  administrador?: boolean;
  // apellidos: string;
  // telefono: string;
  // direccion: string;
  uid: string;
}

export interface PedidoCarrito {
  id: string;
  usuario?: Usuario;
  producto: ProductoPedido[];
  precioTotal: number;
  estado: EstadoPedido;
  fecha?: any;
}

export interface ProductoPedido {
  producto: Producto;
  cantidad: number;
  total: number;
}

export interface Producto {
  marca: string;
  modelo: string;
  // descripcion: string;
  precio: number;
  // procesador: string;
  // camara: string;
  // rom: number;
  // ram:number
  // calificacion: number;
  url: string;
  idFirebase: string;
}

export type EstadoPedido =
  | 'Enviado'
  | 'En Camino'
  | 'Entregado'
  | 'En Proceso de Envio';
