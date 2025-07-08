import supabase from "../services/supabaseClient";

export const obtenerFacturasDelDia = async () => {
  const hoy = new Date();
  const desde = new Date(hoy.setHours(0, 0, 0, 0)).toISOString();
  const hasta = new Date(hoy.setHours(23, 59, 59, 999)).toISOString();

  const { data, error } = await supabase
    .from("facturas")
    .select(
      `
      id,
      fecha,
      total,
      clientes (
        cliente,
        negocio
      )
    `
    )
    .gte("fecha", desde)
    .lte("fecha", hasta)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error al obtener facturas del día:", error);
    return [];
  }

  return data || [];
};
