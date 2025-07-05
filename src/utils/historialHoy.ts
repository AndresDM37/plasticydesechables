import supabase from "../services/supabaseClient";

export const obtenerFacturasDelDia = async () => {
  const hoy = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  const { data, error } = await supabase
    .from("facturas")
    .select(`
      id,
      fecha,
      total,
      clientes (
        negocio,
        cliente
      )
    `)
    .eq("fecha", hoy)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error al obtener facturas del día:", error);
    return [];
  }

  return data || [];
};
