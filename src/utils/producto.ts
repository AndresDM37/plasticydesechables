import supabase from "../services/supabaseClient";
import type { Producto } from "../types/index";

export const obtenerProductos = async () => {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error al obtener productos:", error);
  }

  return data || [];
};

export const eliminarProductoPorId = async (id: number) => {
  await supabase.from("productos").delete().eq("id", id);
};

export const crearProducto = async (producto: Partial<Producto>) => {
  await supabase.from("productos").insert([producto]);
};

export const actualizarProducto = async (
  id: number,
  producto: Partial<Producto>
) => {
  await supabase.from("productos").update(producto).eq("id", id);
};
