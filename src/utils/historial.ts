import supabase from "../services/supabaseClient";

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
    .select(
      `
    *,
    clientes (*),
    items_factura (
      *,
      productos (*)
    )
  `
    )
    .eq("id", facturaId)
    .single();

  if (error) {
    console.error("Error al obtener detalle de factura", error);
    return null;
  }

  return data;
};

export const eliminarFactura = async (id: number): Promise<boolean> => {
  const { error } = await supabase.from("facturas").delete().eq("id", id);

  if (error) {
    console.error("Error al eliminar factura:", error);
    return false;
  }

  return true;
};
