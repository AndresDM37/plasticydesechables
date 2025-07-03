import { useEffect, useState } from "react";
import type { Cliente } from "../types/index";
import {
  obtenerClientes,
  eliminarClientePorId,
  crearCliente,
  actualizarCliente,
} from "../utils/clientes";
import FormularioCliente from "../components/FormularioCliente";
import Layout from "./Layout";

export default function ListaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEnEdicion, setClienteEnEdicion] = useState<Cliente | null>(
    null
  );
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const data = await obtenerClientes();
    setClientes(data);
  };

  const eliminar = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este cliente?")) {
      await eliminarClientePorId(id);
      cargar();
    }
  };

  const abrirNuevoCliente = () => {
    setClienteEnEdicion(null);
    setMostrarFormulario(true);
  };

  const editarCliente = (cliente: Cliente) => {
    setClienteEnEdicion(cliente);
    setMostrarFormulario(true);
  };

  const guardarCliente = async (cliente: Partial<Cliente>) => {
    if (clienteEnEdicion) {
      await actualizarCliente(clienteEnEdicion.id, cliente);
      alert("✅ Cliente editado correctamente.");
    } else {
      await crearCliente(cliente);
      alert("✅ Cliente creado correctamente.");
    }
    setMostrarFormulario(false);
    cargar();
  };

  const cancelar = () => {
    setMostrarFormulario(false);
    setClienteEnEdicion(null);
  };

  // Filtros y paginación
  const clientesFiltrados = clientes.filter(
    (cliente) =>
      busqueda === "" ||
      cliente.negocio?.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.cliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.identificacion?.includes(busqueda) ||
      cliente.telefono?.includes(busqueda) ||
      cliente.id.toString().includes(busqueda)
  );

  const totalPaginas = Math.ceil(clientesFiltrados.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const clientesPaginados = clientesFiltrados.slice(
    inicio,
    inicio + itemsPorPagina
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
              Gestión de Clientes
            </h1>
            <p className="text-gray-600 text-sm">
              Administra tu base de datos de clientes
            </p>
          </div>

          {/* Barra de búsqueda y botón agregar */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="🔍 Buscar cliente..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <button
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-150 flex items-center gap-2 cursor-pointer"
              onClick={abrirNuevoCliente}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline">Añadir Cliente</span>
              <span className="sm:hidden">Añadir</span>
            </button>
          </div>

          {/* Popup Formulario */}
          {mostrarFormulario && (
            <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {clienteEnEdicion ? "Editar Cliente" : "Nuevo Cliente"}
                    </h2>
                    <button
                      onClick={cancelar}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="w-6 h-6"
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
                    </button>
                  </div>

                  <FormularioCliente
                    onGuardar={guardarCliente}
                    clienteEditar={clienteEnEdicion}
                    onCancelar={cancelar}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Lista de clientes - Desktop */}
          <div className="hidden xl:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Negocio
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dirección
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Identificación
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientesPaginados.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{cliente.id.toString().padStart(4, "0")}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cliente.negocio || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cliente.cliente || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {cliente.direccion || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cliente.telefono || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cliente.identificacion || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs transition-colors duration-150 cursor-pointer"
                          onClick={() => editarCliente(cliente)}
                        >
                          Editar
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition-colors duration-150 cursor-pointer"
                          onClick={() => eliminar(cliente.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lista de clientes - Tablet */}
          <div className="hidden lg:block xl:hidden bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Negocio
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientesPaginados.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {cliente.cliente || "-"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {cliente.id.toString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {cliente.negocio || "-"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {cliente.telefono || "-"}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-32">
                          {cliente.direccion || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs transition-colors duration-150 cursor-pointer"
                          onClick={() => editarCliente(cliente)}
                        >
                          Editar
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition-colors duration-150 cursor-pointercursor-pointer"
                          onClick={() => eliminar(cliente.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lista de clientes - Mobile */}
          <div className="lg:hidden bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {clientesPaginados.map((cliente) => (
                <div key={cliente.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">
                          {cliente.id.toString()}
                        </span>
                      </div>

                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {cliente.cliente || "Sin nombre"}
                      </h3>

                      {cliente.negocio && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Negocio:</span>{" "}
                          {cliente.negocio}
                        </p>
                      )}

                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        {cliente.telefono && (
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-3 h-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span>{cliente.telefono}</span>
                          </div>
                        )}

                        {cliente.direccion && (
                          <div className="flex items-start gap-2">
                            <svg
                              className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="text-xs leading-tight">
                              {cliente.direccion}
                            </span>
                          </div>
                        )}

                        {cliente.identificacion && (
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-3 h-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                              />
                            </svg>
                            <span className="text-xs">
                              {cliente.identificacion}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs transition-colors duration-150 cursor-pointer"
                          onClick={() => editarCliente(cliente)}
                        >
                          Editar
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition-colors duration-150 cursor-pointer"
                          onClick={() => eliminar(cliente.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mensaje cuando no hay clientes */}
          {clientesPaginados.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                {busqueda ? "No se encontraron clientes" : "No hay clientes"}
              </h3>
              <p className="text-sm text-gray-500">
                {busqueda
                  ? "Intenta con otra búsqueda"
                  : "Comienza agregando tu primer cliente"}
              </p>
            </div>
          )}

          {/* Paginación */}
          {clientesFiltrados.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Ítems por página</span>
                <select
                  value={itemsPorPagina}
                  onChange={(e) => {
                    setItemsPorPagina(Number(e.target.value));
                    setPaginaActual(1);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {inicio + 1} -{" "}
                  {Math.min(inicio + itemsPorPagina, clientesFiltrados.length)}{" "}
                  de {clientesFiltrados.length}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setPaginaActual(Math.max(1, paginaActual - 1))
                    }
                    disabled={paginaActual === 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4 cursor-pointer"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() =>
                      setPaginaActual(Math.min(totalPaginas, paginaActual + 1))
                    }
                    disabled={paginaActual === totalPaginas}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4 cursor-pointer"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
