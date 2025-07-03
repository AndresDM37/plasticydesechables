export interface Cliente {
  id: number;
  negocio: string;
  cliente: string;
  direccion: string;
  telefono: string;
  identificacion: string;
}

export interface Producto {
  id: number;
  descripcion: string;
  precio_venta: number;
  precio_venta2: number;
}

export interface ProductoFactura {
  id: number;
  descripcion: string;
  precio: number; 
  precio_venta1: number;
  precio_venta2?: number;
  cantidad: number;
  subtotal: number;
}


export interface Factura {
  id: number;
  fecha: string;
  total: number;
  clientes?: {
    cliente: string;
    negocio: string;
  };
}

export interface DetalleFactura {
  id: number;
  fecha: string;
  total: number;
  clientes: {
    cliente: string;
    negocio: string;
    direccion: string;
    telefono: string;
  };
  items_factura: {
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    productos: {
      descripcion: string;
    };
  }[];
}

