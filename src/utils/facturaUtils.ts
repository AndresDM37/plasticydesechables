import supabase from "../services/supabaseClient";
import type { Cliente, ProductoFactura } from "../types/index";

const obtenerFechaColombia = () => {
  const now = new Date();
  const offsetColombia = -5 * 60; // minutos
  const localDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000 + offsetColombia * 60000
  );
  return localDate.toISOString().slice(0, 19); // formato compatible con Supabase sin Z
};

export const obtenerNumeroFactura = async (): Promise<string> => {
  const { data, error } = await supabase
    .from("facturas")
    .select("id")
    .order("id", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error al obtener el número de factura:", error);
  }

  const lastId = data?.[0]?.id || 0;
  return (lastId + 1).toString().padStart(4, "0");
};

export const buscarClientePorId = async (id: number) => {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error al buscar cliente:", error);
  }

  return data;
};

export const buscarClientes = async (texto: string) => {
  if (!texto || texto.trim().length < 2) return [];

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .or(
      `cliente.ilike.%${texto}%,negocio.ilike.%${texto}%,id.eq.${
        isNaN(Number(texto)) ? 0 : Number(texto)
      }`
    )
    .limit(10);

  if (error) {
    console.error("Error al buscar clientes:", error);
    return [];
  }

  return data || [];
};

export const buscarProductoPorCodigo = async (id: string) => {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error al buscar producto:", error);
  }

  return data;
};

export const buscarProductos = async (texto: string) => {
  if (!texto || texto.trim().length < 2) return [];

  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .or(
      `descripcion.ilike.%${texto}%,id.eq.${
        isNaN(Number(texto)) ? 0 : Number(texto)
      }`
    )
    .limit(10);

  if (error) {
    console.error("Error al buscar productos:", error);
    return [];
  }

  return data || [];
};

export const guardarFacturaConHistorial = async (
  cliente: Cliente,
  productos: ProductoFactura[],
  total: number,
  observaciones: string
): Promise<boolean> => {
  try {
    // 1. Insertar en `facturas`

    const fechaActual = obtenerFechaColombia();
    const { data: facturaData, error: facturaError } = await supabase
      .from("facturas")
      .insert({
        cliente_id: cliente.id,
        fecha: fechaActual,
        cantidad: productos.reduce((acc, p) => acc + p.cantidad, 0),
        subtotal: total,
        total: total,
        observaciones,
      })
      .select()
      .single();

    if (facturaError) throw facturaError;

    const nuevaFacturaId = facturaData.id;

    // 2. Insertar productos en `items_factura`
    const items = productos.map((p) => ({
      factura_id: nuevaFacturaId,
      producto_id: p.id,
      cantidad: p.cantidad,
      precio_unitario: p.precio,
      subtotal: p.subtotal,
    }));

    const { error: itemsError } = await supabase
      .from("items_factura")
      .insert(items);
    if (itemsError) throw itemsError;

    // 3. Insertar en `historial_facturas`
    const { error: historialError } = await supabase
      .from("historial_facturas")
      .insert({
        factura_id: nuevaFacturaId,
        cliente_id: cliente.id,
        total: total,
        fecha: fechaActual,
        observaciones,
      });

    if (historialError) throw historialError;

    return true;
  } catch (error) {
    console.error("Error al guardar factura:", error);
    return false;
  }
};

export const actualizarFacturaConHistorial = async (
  facturaId: number,
  cliente: Cliente,
  productos: ProductoFactura[],
  total: number,
  observaciones: string
): Promise<boolean> => {
  try {
    const fechaActual = obtenerFechaColombia();

    // 1. Actualizar la factura principal
    const { error: facturaError } = await supabase
      .from("facturas")
      .update({
        cliente_id: cliente.id,
        fecha: fechaActual,
        cantidad: productos.reduce((acc, p) => acc + p.cantidad, 0),
        subtotal: total,
        total: total,
        observaciones,
      })
      .eq("id", facturaId);

    if (facturaError) throw facturaError;

    // 2. Eliminar items existentes
    const { error: deleteItemsError } = await supabase
      .from("items_factura")
      .delete()
      .eq("factura_id", facturaId);

    if (deleteItemsError) throw deleteItemsError;

    // 3. Insertar nuevos items
    const items = productos.map((p) => {
      console.log("Producto para guardar:", p);
      return {
        factura_id: facturaId,
        producto_id: p.id,
        cantidad: p.cantidad,
        precio_unitario: p.precio,
        subtotal: p.subtotal,
      };
    });

    const { error: itemsError } = await supabase
      .from("items_factura")
      .insert(items);
    if (itemsError) throw itemsError;

    // 4. Actualizar historial
    const { error: historialError } = await supabase
      .from("historial_facturas")
      .update({
        cliente_id: cliente.id,
        total: total,
        fecha: fechaActual,
        observaciones
      })
      .eq("factura_id", facturaId);

    if (historialError) throw historialError;

    return true;
  } catch (error) {
    console.error("Error al actualizar factura:", error);
    return false;
  }
};

// Función para convertir datos de detalle a formato editable
export const convertirDetalleAEditable = (detalle: any) => {
  const cliente: Cliente = {
    id: detalle.clientes.id,
    cliente: detalle.clientes.cliente,
    negocio: detalle.clientes.negocio,
    identificacion: detalle.clientes.identificacion,
    direccion: detalle.clientes.direccion,
    telefono: detalle.clientes.telefono,
  };

  const productos: ProductoFactura[] = detalle.items_factura.map(
    (item: any) => {
      // Verificar si tiene la información del producto
      if (item.productos && item.productos.descripcion) {
        return {
          id: item.producto_id,
          descripcion: item.productos.descripcion,
          precio: item.precio_unitario,
          precio_venta1: item.productos.precio_venta1 || item.precio_unitario,
          precio_venta2: item.productos.precio_venta2 || item.precio_unitario,
          cantidad: item.cantidad,
          subtotal: item.subtotal,
        };
      } else {
        // Si no tiene la información del producto, usar valores por defecto
        console.warn(
          `Producto ${item.producto_id} no tiene descripción completa`
        );
        return {
          id: item.producto_id,
          descripcion: `Producto ${item.producto_id}`,
          precio: item.precio_unitario,
          precio_venta1: item.precio_unitario,
          precio_venta2: item.precio_unitario,
          cantidad: item.cantidad,
          subtotal: item.subtotal,
        };
      }
    }
  );

  return { cliente, productos };
};
