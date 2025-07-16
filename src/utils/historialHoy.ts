import supabase from "../services/supabaseClient";

const obtenerRangoDiaColombia = () => {
  const now = new Date();

  // Ajustar al timezone de Colombia (UTC-5)
  const utcOffset = now.getTimezoneOffset(); // en minutos
  const colombiaOffset = 5 * 60; // UTC-5

  const diferencia = utcOffset - colombiaOffset;

  // Crear fecha con hora inicial del día (00:00:00.000)
  const desde = new Date(now);
  desde.setMinutes(desde.getMinutes() + diferencia);
  desde.setHours(0, 0, 0, 0);

  // Crear fecha con hora final del día (23:59:59.999)
  const hasta = new Date(now);
  hasta.setMinutes(hasta.getMinutes() + diferencia);
  hasta.setHours(23, 59, 59, 999);

  return {
    desde: desde.toISOString(),
    hasta: hasta.toISOString(),
  };
};

export const obtenerFacturasDelDia = async () => {
  const { desde, hasta } = obtenerRangoDiaColombia();

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
