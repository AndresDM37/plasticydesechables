import { useEffect, useState } from "react";
import type { Cliente } from "../types/index";

interface Props {
  onGuardar: (cliente: Partial<Cliente>) => void;
  clienteEditar?: Cliente | null;
  onCancelar: () => void;
}

export default function FormularioCliente({ onGuardar, clienteEditar, onCancelar }: Props) {
  const [cliente, setCliente] = useState<Partial<Cliente>>({
    negocio: "",
    cliente: "",
    direccion: "",
    telefono: "",
    identificacion: "",
  });

  useEffect(() => {
    if (clienteEditar) setCliente(clienteEditar);
  }, [clienteEditar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(cliente);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded">
      <div>
        <label>Negocio:</label>
        <input name="negocio" value={cliente.negocio || ""} onChange={handleChange} className="border w-full p-1" />
      </div>
      <div>
        <label>Nombre del Cliente:</label>
        <input name="cliente" value={cliente.cliente || ""} onChange={handleChange} className="border w-full p-1" required />
      </div>
      <div>
        <label>Dirección:</label>
        <input name="direccion" value={cliente.direccion || ""} onChange={handleChange} className="border w-full p-1" />
      </div>
      <div>
        <label>Teléfono:</label>
        <input name="telefono" value={cliente.telefono || ""} onChange={handleChange} className="border w-full p-1" />
      </div>
      <div>
        <label>Identificación:</label>
        <input name="identificacion" value={cliente.identificacion || ""} onChange={handleChange} className="border w-full p-1" />
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={onCancelar} className="px-4 py-1 bg-gray-300 rounded cursor-pointer">Cancelar</button>
        <button type="submit" className="px-4 py-1 bg-orange-600 text-white rounded cursor-pointer">Guardar</button>
      </div>
    </form>
  );
}
