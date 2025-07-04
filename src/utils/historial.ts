import supabase  from '../services/supabaseClient';

export const obtenerFacturasConCliente = async () => {
  const { data, error } = await supabase
    .from("facturas")
    .select("id, fecha, total, clientes (cliente, negocio)")
    .order("id", { ascending: false });

  if (error) {
    console.error("Error al cargar facturas", error);
    return [];
  }

  return data;
};

export const obtenerFacturaConDetalle = async (facturaId: number) => {
  const { data, error } = await supabase
    .from("facturas")
    .select(`
      id,
      fecha,
      total,
      clientes (
        cliente,
        negocio,
        identificacion,
        direccion,
        telefono
      ),
      items_factura (
        cantidad,
        precio_unitario,
        subtotal,
        productos (
          descripcion
        )
      )
    `)
    .eq("id", facturaId)
    .single();

  if (error) {
    console.error("Error al obtener detalle de factura", error);
    return null;
  }

  return data;
};