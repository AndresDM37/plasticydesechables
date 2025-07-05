import supabase from "../services/supabaseClient";
import type { Cliente, ProductoFactura } from "../types/index";

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
  total: number
): Promise<boolean> => {
  try {
    // 1. Insertar en `facturas`
    const { data: facturaData, error: facturaError } = await supabase
      .from("facturas")
      .insert({
        cliente_id: cliente.id,
        fecha: new Date().toISOString(),
        cantidad: productos.reduce((acc, p) => acc + p.cantidad, 0),
        subtotal: total,
        total: total,
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
        fecha: new Date().toISOString(),
      });

    if (historialError) throw historialError;

    return true;
  } catch (error) {
    console.error("Error al guardar factura:", error);
    return false;
  }
};

