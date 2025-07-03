import { useState, useEffect } from "react";
import type { Producto } from "../types";

interface Props {
  onGuardar: (producto: Partial<Producto>) => void;
  productoEditar?: Producto | null;
  onCancelar: () => void;
}

function FormularioProducto({ onGuardar, productoEditar, onCancelar }: Props) {
  const [producto, setProducto] = useState<Partial<Producto>>({
    descripcion: "",
    precio_venta: 0,
    precio_venta2: 0,
  });

  useEffect(() => {
    if (productoEditar) setProducto(productoEditar);
  }, [productoEditar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: name.includes("precio") ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(producto);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded">
      <div>
        <label>Descripción:</label>
        <input
          name="descripcion"
          value={producto.descripcion || ""}
          onChange={handleChange}
          className="border w-full p-1"
          required
        />
      </div>
      <div>
        <label>Precio Venta:</label>
        <input
          name="precio_venta"
          type="number"
          value={producto.precio_venta || 0}
          onChange={handleChange}
          className="border w-full p-1"
          required
        />
      </div>
      <div>
        <label>Precio Venta 2:</label>
        <input
          name="precio_venta2"
          type="number"
          value={producto.precio_venta2 || 0}
          onChange={handleChange}
          className="border w-full p-1"
        />
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-1 bg-gray-300 rounded cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-1 bg-orange-600 text-white rounded cursor-pointer"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}

export default FormularioProducto;
