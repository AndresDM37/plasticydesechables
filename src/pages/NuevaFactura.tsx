import { useEffect, useState, useRef } from "react";
import Layout from "./Layout";
import type { Cliente, ProductoFactura } from "../types/index";
import {
  obtenerNumeroFactura,
  buscarClientePorId,
  buscarProductoPorCodigo,
  buscarClientes,
  buscarProductos,
  guardarFacturaConHistorial,
} from "../utils/facturaUtils";

function NuevaFactura() {
  const [numeroFactura, setNumeroFactura] = useState("");
  const [codigoCliente, setCodigoCliente] = useState("");
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [productos, setProductos] = useState<ProductoFactura[]>([]);
  const [codigoProducto, setCodigoProducto] = useState("");
  const [total, setTotal] = useState(0);

  // Estados para autocompletado de clientes
  const [clientesSugeridos, setClientesSugeridos] = useState<Cliente[]>([]);
  const [mostrarSugerenciasCliente, setMostrarSugerenciasCliente] =
    useState(false);
  const clienteInputRef = useRef<HTMLInputElement>(null);

  // Estados para autocompletado de productos
  const [productosSugeridos, setProductosSugeridos] = useState<any[]>([]);
  const [mostrarSugerenciasProducto, setMostrarSugerenciasProducto] =
    useState(false);
  const productoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    obtenerNumeroFactura().then(setNumeroFactura);
  }, []);

  useEffect(() => {
    const nuevoTotal = productos.reduce(
      (acc, prod) => acc + prod.precio * prod.cantidad,
      0
    );
    setTotal(nuevoTotal);
  }, [productos]);

  // Función para buscar clientes mientras se escribe
  const handleBuscarClienteInput = async (valor: string) => {
    setCodigoCliente(valor);

    if (valor.trim().length >= 2) {
      const resultados = await buscarClientes(valor);
      setClientesSugeridos(resultados);
      setMostrarSugerenciasCliente(true);
    } else {
      setClientesSugeridos([]);
      setMostrarSugerenciasCliente(false);
    }

    // Limpiar cliente seleccionado si se está editando
    if (cliente) {
      setCliente(null);
    }
  };

  // Función para seleccionar un cliente de las sugerencias
  const seleccionarCliente = (clienteSeleccionado: Cliente) => {
    setCliente(clienteSeleccionado);
    setCodigoCliente(clienteSeleccionado.id.toString());
    setMostrarSugerenciasCliente(false);
    setClientesSugeridos([]);
  };

  // Función para buscar productos mientras se escribe
  const handleBuscarProductoInput = async (valor: string) => {
    setCodigoProducto(valor);

    if (valor.trim().length >= 2) {
      const resultados = await buscarProductos(valor);
      setProductosSugeridos(resultados);
      setMostrarSugerenciasProducto(true);
    } else {
      setProductosSugeridos([]);
      setMostrarSugerenciasProducto(false);
    }
  };

  // Función para agregar producto seleccionado
  const agregarProductoSeleccionado = (producto: any) => {
    const item: ProductoFactura = {
      id: producto.id,
      descripcion: producto.descripcion,
      precio: producto.precio_venta,
      precio_venta1: producto.precio_venta,
      precio_venta2: producto.precio_venta2,
      cantidad: 1,
      subtotal: producto.precio_venta,
    };
    setProductos([...productos, item]);
    setCodigoProducto("");
    setMostrarSugerenciasProducto(false);
    setProductosSugeridos([]);

    setTimeout(() => {
      productoInputRef.current?.focus();
      productoInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleBuscarCliente = async () => {
    const cli = await buscarClientePorId(parseInt(codigoCliente));
    setCliente(cli);
  };

  const handleAgregarProducto = async () => {
    const producto = await buscarProductoPorCodigo(codigoProducto);
    if (producto) {
      const item: ProductoFactura = {
        id: producto.id,
        descripcion: producto.descripcion,
        precio: producto.precio_venta,
        precio_venta1: producto.precio_venta,
        precio_venta2: producto.precio_venta2,
        cantidad: 1,
        subtotal: producto.precio_venta,
      };
      setProductos([...productos, item]);
      setCodigoProducto("");
      setMostrarSugerenciasProducto(false);

      setTimeout(() => {
        productoInputRef.current?.focus();
        productoInputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  const actualizarCantidad = (index: number, nuevaCantidad: number) => {
    const copia = [...productos];
    copia[index].cantidad = nuevaCantidad;
    copia[index].subtotal = nuevaCantidad * copia[index].precio;
    setProductos(copia);
  };

  const eliminarProducto = (index: number) => {
    const copia = [...productos];
    copia.splice(index, 1);
    setProductos(copia);
  };

  const guardarFactura = async () => {
    if (!cliente || productos.length === 0) {
      alert("Debes seleccionar un cliente y al menos un producto.");
      return;
    }

    const exito = await guardarFacturaConHistorial(cliente, productos, total);

    if (exito) {
      alert("Factura guardada correctamente ✅");
      // Reset
      setProductos([]);
      setCliente(null);
      setCodigoCliente("");
      setTotal(0);
      setNumeroFactura(await obtenerNumeroFactura());
    } else {
      alert("Error al guardar la factura ❌");
    }
  };

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        clienteInputRef.current &&
        !clienteInputRef.current.contains(event.target as Node)
      ) {
        setMostrarSugerenciasCliente(false);
      }
      if (
        productoInputRef.current &&
        !productoInputRef.current.contains(event.target as Node)
      ) {
        setMostrarSugerenciasProducto(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
              Crear Nueva Factura
            </h1>
          </div>

          {/* Factura Design */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header de la factura */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center text-white">
                <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                  <div>
                    <img
                      src="/assets/images/image.png"
                      alt="icono"
                      className="w-[200px]"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl lg:text-3xl font-bold">
                    No. Factura # {numeroFactura}
                  </div>
                  <div className="text-orange-100 text-sm lg:text-base">
                    Fecha: {new Date().toLocaleDateString("es-CO")}
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido de la factura */}
            <div className="p-4 lg:p-6">
              {/* Información de la empresa y cliente */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Información de la empresa */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Factura de:
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium">OP Plasticos y Desechables</p>
                    <p>52081219-2</p>
                    <p>(57) 3133649085</p>
                    <p>Bogotá - Colombia</p>
                    <p>opplasticosydesechables@gmail.com</p>
                  </div>
                </div>

                {/* Información del cliente */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Factura para:
                  </h3>

                  {/* Búsqueda de cliente con autocompletado */}
                  <div className="relative" ref={clienteInputRef}>
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Buscar por código, nombre o negocio..."
                        value={codigoCliente}
                        onChange={(e) =>
                          handleBuscarClienteInput(e.target.value)
                        }
                        onFocus={() => {
                          if (clientesSugeridos.length > 0) {
                            setMostrarSugerenciasCliente(true);
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        onClick={handleBuscarCliente}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors cursor-pointer"
                      >
                        Buscar
                      </button>
                    </div>

                    {/* Sugerencias de clientes */}
                    {mostrarSugerenciasCliente &&
                      clientesSugeridos.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {clientesSugeridos.map((cli) => (
                            <div
                              key={cli.id}
                              onClick={() => seleccionarCliente(cli)}
                              className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-sm">
                                {cli.negocio}
                              </div>
                              <div className="text-xs text-gray-600">
                                {cli.cliente}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {cli.id} | Tel: {cli.telefono}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* Información del cliente encontrado */}
                  {cliente ? (
                    <div className="text-sm text-gray-600 space-y-1 p-3 bg-gray-50 rounded-md">
                      <p className="font-medium">{cliente.negocio}</p>
                      <p>{cliente.cliente}</p>
                      <p>ID: {cliente.identificacion}</p>
                      <p>Tel: {cliente.telefono}</p>
                      <p>{cliente.direccion}</p>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 p-3 bg-gray-50 rounded-md">
                      <p>No se ha seleccionado cliente</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Agregar producto con autocompletado */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Agregar Producto:
                </h3>
                <div className="relative" ref={productoInputRef}>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Buscar por código o descripción..."
                      value={codigoProducto}
                      onChange={(e) =>
                        handleBuscarProductoInput(e.target.value)
                      }
                      onFocus={() => {
                        if (productosSugeridos.length > 0) {
                          setMostrarSugerenciasProducto(true);
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      onClick={handleAgregarProducto}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer"
                    >
                      Agregar
                    </button>
                  </div>

                  {/* Sugerencias de productos */}
                  {mostrarSugerenciasProducto &&
                    productosSugeridos.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                        {productosSugeridos.map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => agregarProductoSeleccionado(prod)}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-sm">
                              {prod.id} - {prod.descripcion} - $
                              {(prod.precio_venta || 0).toLocaleString("es-CO")}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </div>

              {/* Tabla de productos */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="px-3 py-3 text-left text-sm font-medium">
                        Cod
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium">
                        Cant
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium">
                        Producto
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium">
                        Vr.Unit
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium">
                        Vr.Total
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((prod, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-3 py-3 text-sm">{prod.id}</td>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            min="1"
                            value={prod.cantidad}
                            onChange={(e) =>
                              actualizarCantidad(i, parseInt(e.target.value))
                            }
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </td>
                        <td className="px-3 py-3 text-sm">
                          {prod.descripcion}
                        </td>
                        <td className="px-3 py-3">
                          {prod.precio_venta2 &&
                          prod.precio_venta2 !== prod.precio_venta1 ? (
                            <div className="space-y-1">
                              <select
                                value={
                                  prod.precio === prod.precio_venta1
                                    ? "precio1"
                                    : prod.precio === prod.precio_venta2
                                    ? "precio2"
                                    : "manual"
                                }
                                onChange={(e) => {
                                  const copia = [...productos];
                                  if (e.target.value === "precio1") {
                                    copia[i].precio = prod.precio_venta1;
                                  } else if (e.target.value === "precio2") {
                                    copia[i].precio = prod.precio_venta2!;
                                  }
                                  copia[i].subtotal =
                                    copia[i].cantidad * copia[i].precio;
                                  setProductos(copia);
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                              >
                                <option value="precio1">
                                  ${prod.precio_venta1.toLocaleString("es-CO")}
                                </option>
                                <option value="precio2">
                                  ${prod.precio_venta2.toLocaleString("es-CO")}
                                </option>
                                <option value="manual">Manual</option>
                              </select>
                              <input
                                type="number"
                                value={prod.precio}
                                onChange={(e) => {
                                  const copia = [...productos];
                                  copia[i].precio = parseFloat(e.target.value);
                                  copia[i].subtotal =
                                    copia[i].cantidad * copia[i].precio;
                                  setProductos(copia);
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                          ) : (
                            <input
                              type="number"
                              value={prod.precio}
                              onChange={(e) => {
                                const copia = [...productos];
                                copia[i].precio =
                                  parseFloat(e.target.value) || 0;
                                copia[i].subtotal =
                                  copia[i].cantidad * copia[i].precio;
                                setProductos(copia);
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          )}
                        </td>
                        <td className="px-3 py-3 text-sm font-medium">
                          ${prod.subtotal.toLocaleString("es-CO")}
                        </td>
                        <td className="px-3 py-3">
                          <button
                            onClick={() => eliminarProducto(i)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {productos.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-3 py-8 text-center text-gray-500"
                        >
                          No hay productos agregados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Términos y Total */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 mt-6 print:mt-4">
                {/* Términos y Condiciones */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm print:text-black print:text-xs border-b border-gray-200 pb-1">
                    Términos & Condiciones
                  </h4>
                  <div className="text-[10px] text-gray-600 leading-relaxed print:text-black print:text-[8px] print:leading-tight">
                    <div className="bg-gray-50 p-3 rounded-md print:bg-transparent print:p-0 border-l-2 border-gray-300 print:border-l-0">
                      <p className="text-justify">
                        A ESTA FACTURA DE VENTA APLICAN LAS NORMAS RELATIVAS A
                        LA LETRA DE CAMBIO (ARTÍCULO 5 LEY 1231 DE 2008)
                      </p>
                      <br />
                      <p className="text-justify">
                        NO RESPONSABLE DE IVA - ACTIVIDAD ECONÓMICA 4799 OTROS
                        TIPOS DE COMERCIO AL POR MENOR NO REALIZADO EN
                        ESTABLECIMIENTOS, PUESTOS DE VENTA O MERCADOS.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="text-right">
                  <div className="bg-gray-800 text-white p-4 rounded-lg">
                    <div className="text-lg font-semibold mb-2">
                      TOTAL A PAGAR
                    </div>
                    <div className="text-3xl font-bold">
                      ${total.toLocaleString("es-CO")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t">
                <button
                  onClick={guardarFactura}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NuevaFactura;
