import supabase from "../services/supabaseClient";
import type { Cliente } from "../types";

export const obtenerClientes = async () => {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error al obtener clientes:", error);
  }

  return data || [];
};

export const eliminarClientePorId = async (id: number) => {
  await supabase.from("clientes").delete().eq("id", id);
};

export const crearCliente = async (cliente: Partial<Cliente>) => {
  await supabase.from("clientes").insert([cliente]);
};

export const actualizarCliente = async (
  id: number,
  cliente: Partial<Cliente>
) => {
  await supabase.from("clientes").update(cliente).eq("id", id);
};
