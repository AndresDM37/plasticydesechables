import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Layout from "./Layout";
import { obtenerFacturaConDetalle } from "../utils/historial";
import {
  actualizarFacturaConHistorial,
  convertirDetalleAEditable,
  buscarClientes,
  buscarProductos,
  buscarProductoPorCodigo,
} from "../utils/facturaUtils";
import type { DetalleFactura, Cliente, ProductoFactura } from "../types/index";

function FacturaDetalle() {
  const { id } = useParams();
  const [factura, setFactura] = useState<DetalleFactura | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Estados para edición
  const [clienteEdicion, setClienteEdicion] = useState<Cliente | null>(null);
  const [productosEdicion, setProductosEdicion] = useState<ProductoFactura[]>(
    []
  );
  const [totalEdicion, setTotalEdicion] = useState(0);
  const [codigoCliente, setCodigoCliente] = useState("");
  const [codigoProducto, setCodigoProducto] = useState("");
  const [observaciones, setObservaciones] = useState("");

  // Estados para autocompletado
  const [clientesSugeridos, setClientesSugeridos] = useState<Cliente[]>([]);
  const [mostrarSugerenciasCliente, setMostrarSugerenciasCliente] =
    useState(false);
  const [productosSugeridos, setProductosSugeridos] = useState<any[]>([]);
  const [mostrarSugerenciasProducto, setMostrarSugerenciasProducto] =
    useState(false);

  // Referencias
  const clienteInputRef = useRef<HTMLInputElement>(null);
  const productoInputRef = useRef<HTMLInputElement>(null);
  const componenteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      cargarFactura();
    }
  }, [id]);

  const cargarFactura = async () => {
    try {
      const facturaData = await obtenerFacturaConDetalle(Number(id));
      if (facturaData) {
        setFactura(facturaData);

        // Preparar datos para edición
        const { cliente, productos } = convertirDetalleAEditable(facturaData);
        setClienteEdicion(cliente);
        setProductosEdicion(productos);
        setCodigoCliente(cliente.negocio || cliente.cliente || "");
        setObservaciones(facturaData.observaciones || "");
      }
    } catch (error) {
      console.error("Error al cargar factura:", error);
      alert("Error al cargar la factura");
    }
  };

  useEffect(() => {
    const nuevoTotal = productosEdicion.reduce(
      (acc, prod) => acc + prod.precio * prod.cantidad,
      0
    );
    setTotalEdicion(nuevoTotal);
  }, [productosEdicion]);

  const handlePrint = useReactToPrint({
    contentRef: componenteRef,
    documentTitle: `Factura_${factura?.id}`,
  });

  const iniciarEdicion = () => {
    setModoEdicion(true);
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    if (factura) {
      const { cliente, productos } = convertirDetalleAEditable(factura);
      setClienteEdicion(cliente);
      setProductosEdicion(productos);
      setCodigoCliente(cliente.negocio || cliente.cliente || "");
    }
  };

  const guardarCambios = async () => {
    if (!clienteEdicion || productosEdicion.length === 0) {
      alert("Debes seleccionar un cliente y al menos un producto.");
      return;
    }

    try {
      const exito = await actualizarFacturaConHistorial(
        Number(id),
        clienteEdicion,
        productosEdicion,
        totalEdicion,
        observaciones
      );

      if (exito) {
        alert("Factura actualizada correctamente ✅");
        setModoEdicion(false);
        // Recargar la factura actualizada
        await cargarFactura();
      } else {
        alert("Error al actualizar la factura ❌");
      }
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("Error al actualizar la factura ❌");
    }
  };

  // Funciones de búsqueda de clientes
  const handleBuscarClienteInput = async (valor: string) => {
    setCodigoCliente(valor);

    if (valor.trim().length >= 2) {
      try {
        const resultados = await buscarClientes(valor);
        setClientesSugeridos(resultados);
        setMostrarSugerenciasCliente(true);
      } catch (error) {
        console.error("Error al buscar clientes:", error);
        setClientesSugeridos([]);
        setMostrarSugerenciasCliente(false);
      }
    } else {
      setClientesSugeridos([]);
      setMostrarSugerenciasCliente(false);
    }

    if (clienteEdicion && clienteEdicion.id.toString() !== valor) {
      setClienteEdicion(null);
    }
  };

  const seleccionarCliente = (clienteSeleccionado: Cliente) => {
    setClienteEdicion(clienteSeleccionado);
    setCodigoCliente(clienteSeleccionado.id.toString());
    setMostrarSugerenciasCliente(false);
    setClientesSugeridos([]);
  };

  // Funciones de búsqueda de productos
  const handleBuscarProductoInput = async (valor: string) => {
    setCodigoProducto(valor);

    if (valor.trim().length >= 2) {
      try {
        const resultados = await buscarProductos(valor);
        setProductosSugeridos(resultados);
        setMostrarSugerenciasProducto(true);
      } catch (error) {
        console.error("Error al buscar productos:", error);
        setProductosSugeridos([]);
        setMostrarSugerenciasProducto(false);
      }
    } else {
      setProductosSugeridos([]);
      setMostrarSugerenciasProducto(false);
    }
  };

  const agregarProductoSeleccionado = (producto: any) => {
    // Verificar que el producto no esté ya en la lista
    const productoExistente = productosEdicion.find(
      (p) => p.id === producto.id
    );
    if (productoExistente) {
      alert("Este producto ya está en la factura");
      return;
    }

    const item: ProductoFactura = {
      id: producto.id,
      descripcion: producto.descripcion,
      precio: producto.precio_venta,
      precio_venta1: producto.precio_venta,
      precio_venta2: producto.precio_venta2,
      cantidad: 1,
      subtotal: producto.precio_venta,
    };
    setProductosEdicion([...productosEdicion, item]);
    setCodigoProducto("");
    setMostrarSugerenciasProducto(false);
    setProductosSugeridos([]);
  };

  const handleAgregarProducto = async () => {
    if (!codigoProducto.trim()) {
      alert("Ingresa un código de producto");
      return;
    }

    try {
      const producto = await buscarProductoPorCodigo(codigoProducto);
      if (producto) {
        // Verificar que el producto no esté ya en la lista
        const productoExistente = productosEdicion.find(
          (p) => p.id === producto.id
        );
        if (productoExistente) {
          alert("Este producto ya está en la factura");
          return;
        }

        const item: ProductoFactura = {
          id: producto.id,
          descripcion: producto.descripcion,
          precio: producto.precio_venta,
          precio_venta1: producto.precio_venta,
          precio_venta2: producto.precio_venta2,
          cantidad: 1,
          subtotal: producto.precio_venta,
        };
        setProductosEdicion([...productosEdicion, item]);
        setCodigoProducto("");
        setMostrarSugerenciasProducto(false);
      } else {
        alert("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al buscar producto:", error);
      alert("Error al buscar el producto");
    }
  };

  const actualizarCantidad = (index: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    const copia = [...productosEdicion];
    copia[index].cantidad = nuevaCantidad;
    copia[index].subtotal = nuevaCantidad * copia[index].precio;
    setProductosEdicion(copia);
  };

  const actualizarPrecio = (index: number, nuevoPrecio: number) => {
    if (nuevoPrecio < 0) {
      alert("El precio no puede ser negativo");
      return;
    }

    const copia = [...productosEdicion];
    copia[index].precio = nuevoPrecio;
    copia[index].subtotal = copia[index].cantidad * nuevoPrecio;
    setProductosEdicion(copia);
  };

  const eliminarProducto = (index: number) => {
    if (productosEdicion.length === 1) {
      alert("Debe haber al menos un producto en la factura");
      return;
    }

    const copia = [...productosEdicion];
    copia.splice(index, 1);
    setProductosEdicion(copia);
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

  // Manejar teclas Enter para agregar productos
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAgregarProducto();
    }
  };

  if (!factura) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando factura...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header con botones */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                {modoEdicion ? "Editar" : "Detalle de"} Factura #
                {factura.id.toString().padStart(4, "0")}
              </h1>
              <div className="flex gap-2">
                {!modoEdicion ? (
                  <>
                    <button
                      onClick={iniciarEdicion}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                      <span>Imprimir</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={guardarCambios}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Guardar</span>
                    </button>
                    <button
                      onClick={cancelarEdicion}
                      className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>Cancelar</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {modoEdicion ? (
              /* MODO EDICIÓN */
              <div className="p-4 lg:p-6">
                {/* Header de edición */}
                <div className="bg-orange-500 p-4 lg:p-6 rounded-lg mb-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center text-white">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div>
                        <img
                          src="/assets/images/image.png"
                          alt="icono"
                          className="w-[150px]"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl lg:text-3xl font-bold">
                        Editando Factura #
                        {factura.id.toString().padStart(4, "0")}
                      </div>
                      <div className="text-blue-100 text-sm lg:text-base">
                        Fecha: {factura.fecha}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del cliente - Edición */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Cliente:</h3>
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
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
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

                    {/* Información del cliente seleccionado */}
                    {clienteEdicion && (
                      <div className="text-sm text-gray-600 space-y-1 p-3 bg-gray-50 rounded-md">
                        <p className="font-medium">{clienteEdicion.negocio}</p>
                        <p>{clienteEdicion.cliente}</p>
                        <p>ID: {clienteEdicion.identificacion}</p>
                        <p>Tel: {clienteEdicion.telefono}</p>
                        <p>{clienteEdicion.direccion}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Agregar producto - Edición */}
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
                        onKeyPress={handleKeyPress}
                        onFocus={() => {
                          if (productosSugeridos.length > 0) {
                            setMostrarSugerenciasProducto(true);
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                {(prod.precio_venta || 0).toLocaleString(
                                  "es-CO"
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>

                {/* Tabla de productos - Edición */}
                <div className="overflow-x-auto mb-6">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="px-3 py-3 text-left text-sm font-medium">
                          Ítem
                        </th>
                        <th className="px-3 py-3 text-left text-sm font-medium">
                          Cant
                        </th>
                        <th className="px-3 py-3 text-left text-sm font-medium">
                          Producto
                        </th>
                        <th className="px-3 py-3 text-left text-sm font-medium">
                          Precio
                        </th>
                        <th className="px-3 py-3 text-left text-sm font-medium">
                          Total
                        </th>
                        <th className="px-3 py-3 text-left text-sm font-medium">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosEdicion.map((prod, i) => (
                        <tr
                          key={i}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-3 py-3 text-sm">{i + 1}</td>
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              step="0.01"
                              min="1"
                              value={prod.cantidad}
                              onChange={(e) =>
                                actualizarCantidad(
                                  i,
                                  parseFloat(e.target.value) || 1
                                )
                              }
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-3 py-3 text-sm">
                            {prod.descripcion}
                          </td>
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={prod.precio}
                              onChange={(e) =>
                                actualizarPrecio(
                                  i,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
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
                    </tbody>
                  </table>
                </div>

                {/* Observaciones - Edición */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Observaciones:
                  </h3>
                  <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    rows={3}
                    placeholder="Observaciones de la factura..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                </div>

                {/* Total - Edición */}
                <div className="text-right">
                  <div className="bg-gray-900 text-white p-4 rounded-lg inline-block">
                    <div className="text-lg font-semibold mb-2">
                      TOTAL A PAGAR
                    </div>
                    <div className="text-3xl font-bold">
                      ${totalEdicion.toLocaleString("es-CO")}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* MODO VISTA */
              <div
                ref={componenteRef}
                className="print:shadow-none max-h-screen print:max-h-none overflow-auto print:overflow-visible"
              >
                <div className="bg-red-400 print:bg-gradient-to-r print:from-white print:to-red-400 p-2 lg:p-3 print:p-4">
                  <div className="flex justify-between items-center text-black">
                    <div className="flex items-center">
                      <div>
                        <img
                          src="/assets/images/image.png"
                          alt="icono"
                          className="w-[120px] lg:w-[150px] print:w-[100px]"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-md lg:text-sm print:text-black font-medium space-y-0.5 print:text-sm">
                        <p className="font-bold text-xl print:text-lg">
                          OP Plasticos y Desechables
                        </p>
                        <p className="text-sm print:text-xs">52081219-2</p>
                        <p className="text-sm print:text-xs">(57) 3133649085</p>
                        <p className="text-sm print:text-xs">
                          Bogotá - Colombia
                        </p>
                        <p className="text-sm print:text-xs">
                          opplasticosydesechables@gmail.com
                        </p>
                      </div>
                    </div>
                    <div className="text-right print:text-black font-bold">
                      <div className="text-lg lg:text-xl font-bold print:text-lg">
                        No. Remisión # {factura.id.toString().padStart(4, "0")}
                      </div>
                      <div className="text-xs lg:text-sm print:text-xs">
                        Fecha: {factura.fecha}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenido de la factura */}
                <div className="p-3 lg:p-4 print:p-3">
                  {/* Información del cliente */}
                  <div className="mb-4 print:grid-cols-2 print:gap-4 print:mb-3">
                    <div>
                      <h3 className="font-semibold text-black mb-1 text-sm print:text-black print:text-xs">
                        Factura para:
                      </h3>
                      <div className="text-xs text-black p-2 bg-gray-50 rounded-md print:bg-transparent print:p-0 print:text-black print:text-[10px]">
                        <div className="grid grid-cols-3 gap-x-8 gap-y-1">
                          <div className="flex">
                            <span className="font-medium w-20">Señores</span>
                            <span className="font-medium text-black print:text-black uppercase">
                              {factura.clientes.negocio}
                            </span>
                          </div>

                          <div className="flex">
                            <span className="font-medium w-20">Teléfono</span>
                            <span className="text-black print:text-black">
                              {factura.clientes.telefono}
                            </span>
                          </div>

                          <div className="flex">
                            <span className="font-medium w-20">Contacto:</span>
                            <span className="text-black print:text-black">
                              {factura.clientes.cliente}
                            </span>
                          </div>

                          <div className="flex">
                            <span className="font-medium w-20">NIT</span>
                            <span className="text-black print:text-black">
                              {factura.clientes.identificacion}
                            </span>
                          </div>

                          <div className="flex">
                            <span className="font-medium w-20">Ciudad</span>
                            <span className="text-black print:text-black">
                              Bogotá - Colombia
                            </span>
                          </div>

                          <div className="flex col-span-2">
                            <span className="font-medium w-20">Dirección</span>
                            <span className="text-black print:text-black">
                              {factura.clientes.direccion}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabla de productos - Optimizada para impresión */}
                  <div className="mb-4 print:mb-2">
                    <h3 className="font-semibold text-black mb-2 text-sm print:text-black print:text-xs print:mb-1">
                      Productos:
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[500px] print:min-w-0 border-collapse">
                        <thead>
                          <tr className="bg-red-400 text-black print:bg-red-400 print:text-black">
                            <th className="px-2 py-2 text-left font-medium text-xs print:text-[9px] print:py-1 border border-red-500">
                              Ítem
                            </th>
                            <th
                              className={`px-2 py-2 text-left font-medium border border-red-500 ${
                                factura.items_factura.length > 20
                                  ? "text-[10px] print:text-[8px] print:py-0.5"
                                  : factura.items_factura.length > 15
                                  ? "text-xs print:text-[9px] print:py-1"
                                  : factura.items_factura.length > 10
                                  ? "text-xs print:text-[9px] print:py-1"
                                  : "text-sm print:text-[9px] print:py-1"
                              }`}
                            >
                              Cant
                            </th>
                            <th
                              className={`px-2 py-2 text-left font-medium border border-red-500 ${
                                factura.items_factura.length > 20
                                  ? "text-[10px] print:text-[8px] print:py-0.5"
                                  : factura.items_factura.length > 15
                                  ? "text-xs print:text-[9px] print:py-1"
                                  : factura.items_factura.length > 10
                                  ? "text-xs print:text-[9px] print:py-1"
                                  : "text-sm print:text-[9px] print:py-1"
                              }`}
                            >
                              Producto
                            </th>
                            <th
                              className={`px-2 py-2 text-left font-medium border border-red-500 ${
                                factura.items_factura.length > 20
                                  ? "text-[10px] print:text-[8px] print:py-0.5"
                                  : factura.items_factura.length > 15
                                  ? "text-xs print:text-[9px] print:py-1"
                                  : factura.items_factura.length > 10
                                  ? "text-xs print:text-[9px] print:py-1"
                                  : "text-sm print:text-[9px] print:py-1"
                              }`}
                            >
                              Vr.Unit
                            </th>
                            <th
                              className={`px-2 py-2 text-left font-medium border border-red-500 ${
                                factura.items_factura.length > 20
                                  ? "text-[10px] print:text-[8px] print:py-0.5"
                                  : factura.items_factura.length > 15
                                  ? "text-xs print:text-[9px] print:py-1"
                                  : factura.items_factura.length > 10
                                  ? "text-xs print:text-[9px] print:py-1"
                                  : "text-sm print:text-[9px] print:py-1"
                              }`}
                            >
                              Vr.Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {factura.items_factura.map((item, i) => (
                            <tr
                              key={i}
                              className="border-b border-gray-200 hover:bg-gray-50 print:hover:bg-transparent"
                            >
                              <td className="px-2 py-2 text-sm print:text-[9px] print:py-0.5 border border-gray-200 text-black">
                                {i + 1}
                              </td>
                              <td
                                className={`px-2 border border-gray-200 text-black ${
                                  factura.items_factura.length > 20
                                    ? "py-0.5 text-[10px] print:text-[8px] print:py-0"
                                    : factura.items_factura.length > 15
                                    ? "py-0.5 text-xs print:text-[9px] print:py-0.5"
                                    : factura.items_factura.length > 10
                                    ? "py-1 text-xs print:text-[9px] print:py-0.5"
                                    : "py-2 text-sm print:text-[9px] print:py-1"
                                }`}
                              >
                                {item.cantidad}
                              </td>
                              <td
                                className={`px-2 border border-gray-200 text-black ${
                                  factura.items_factura.length > 20
                                    ? "py-0.5 text-[10px] print:text-[8px] print:py-0"
                                    : factura.items_factura.length > 15
                                    ? "py-0.5 text-xs print:text-[9px] print:py-0.5"
                                    : factura.items_factura.length > 10
                                    ? "py-1 text-xs print:text-[9px] print:py-0.5"
                                    : "py-2 text-sm print:text-[9px] print:py-1"
                                }`}
                              >
                                {item.productos?.descripcion}
                              </td>
                              <td
                                className={`px-2 border border-gray-200 text-black ${
                                  factura.items_factura.length > 20
                                    ? "py-0.5 text-[10px] print:text-[8px] print:py-0"
                                    : factura.items_factura.length > 15
                                    ? "py-0.5 text-xs print:text-[9px] print:py-0.5"
                                    : factura.items_factura.length > 10
                                    ? "py-1 text-xs print:text-[9px] print:py-0.5"
                                    : "py-2 text-sm print:text-[9px] print:py-1"
                                }`}
                              >
                                ${item.precio_unitario.toLocaleString("es-CO")}
                              </td>
                              <td
                                className={`px-2 font-medium border border-gray-200 text-black ${
                                  factura.items_factura.length > 20
                                    ? "py-0.5 text-[10px] print:text-[8px] print:py-0"
                                    : factura.items_factura.length > 15
                                    ? "py-0.5 text-xs print:text-[9px] print:py-0.5"
                                    : factura.items_factura.length > 10
                                    ? "py-1 text-xs print:text-[9px] print:py-0.5"
                                    : "py-2 text-sm print:text-[9px] print:py-1"
                                }`}
                              >
                                ${item.subtotal.toLocaleString("es-CO")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-black mb-2 text-sm print:text-black print:text-xs print:mb-1">
                      Observaciones:
                    </h3>
                    <div
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {factura.observaciones || "No hay observaciones"}
                    </div>
                  </div>

                  {/* Términos y Total - Optimizado para impresión */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 mt-6 print:mt-2">
                    {/* Términos y Condiciones */}
                    <div className="space-y-2"> 
                      <h4 className="font-semibold text-black mb-2 text-sm print:text-black print:text-xs border-b border-gray-200 pb-1">
                        Términos & Condiciones
                      </h4>
                      <div className="text-[10px] text-black leading-relaxed print:text-black print:text-[8px] print:leading-tight">
                        <div className="bg-gray-50 p-3 rounded-md print:bg-transparent print:p-0 border-l-2 border-gray-300 print:border-l-0">
                          <p className="text-justify">
                            A ESTA FACTURA DE VENTA APLICAN LAS NORMAS RELATIVAS
                            A LA LETRA DE CAMBIO (ARTÍCULO 5 LEY 1231 DE 2008)
                          </p>
                          <br />
                          <p className="text-justify">
                            NO RESPONSABLE DE IVA - ACTIVIDAD ECONÓMICA 4799
                            OTROS TIPOS DE COMERCIO AL POR MENOR NO REALIZADO EN
                            ESTABLECIMIENTOS, PUESTOS DE VENTA O MERCADOS.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex flex-col justify-start lg:justify-center">
                      <div className="space-y-3">
                        {/* Total Principal */}
                        <div className="bg-red-400 text-black p-4 rounded-lg print:bg-red-400 print:text-black print:rounded-none print:p-3 shadow-lg print:shadow-none">
                          <div className="text-center">
                            <div className="text-xs font-medium mb-1 print:text-[10px] opacity-90">
                              TOTAL A PAGAR
                            </div>
                            <div className="text-2xl font-bold print:text-xl tracking-wide">
                              ${factura.total.toLocaleString("es-CO")}
                            </div>
                          </div>
                        </div>

                        {/* Información adicional */}
                        <div className="text-center text-xs text-black print:text-black print:text-[8px] mt-2">
                          <p>!Gracias por su compra¡</p>
                          <p className="font-medium">
                            https://plasticosydesechables.vercel.app | (57)
                            3133649085
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default FacturaDetalle;
