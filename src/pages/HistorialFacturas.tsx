import { useEffect, useState } from "react";
import { obtenerFacturasConCliente } from "../utils/historial";
import type { Factura } from "../types";
import { Link } from "react-router-dom";
import Layout from "./Layout";

function HistorialFacturas() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [rangoFecha, setRangoFecha] = useState({ desde: "", hasta: "" });
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);

  useEffect(() => {
    const cargar = async () => {
      const data = await obtenerFacturasConCliente();
      setFacturas(data);
    };
    cargar();
  }, []);

  const facturasFiltradas = facturas.filter((factura) => {
    // Búsqueda mejorada: por ID, cliente y negocio
    const terminoBusqueda = busqueda.toLowerCase().trim();
    const coincideBusqueda = 
      terminoBusqueda === "" || 
      factura.id.toString().includes(terminoBusqueda) ||
      (factura.clientes?.cliente && factura.clientes.cliente.toLowerCase().includes(terminoBusqueda)) ||
      (factura.clientes?.negocio && factura.clientes.negocio.toLowerCase().includes(terminoBusqueda));

    const coincideRango =
      (!rangoFecha.desde || factura.fecha >= rangoFecha.desde) &&
      (!rangoFecha.hasta || factura.fecha <= rangoFecha.hasta);
    
    return coincideBusqueda && coincideRango;
  });

  // Paginación
  const totalPaginas = Math.ceil(facturasFiltradas.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const facturasPaginadas = facturasFiltradas.slice(
    inicio,
    inicio + itemsPorPagina
  );

  const handleActualizar = async () => {
    const data = await obtenerFacturasConCliente();
    setFacturas(data);
    setPaginaActual(1);
  };

  // Resetear página cuando cambie la búsqueda
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, rangoFecha]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
              Facturas Anteriores
            </h1>
          </div>

          {/* Barra de búsqueda */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar por código, cliente o negocio"
                className="w-full lg:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filtros */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Filtros de fecha
              </h3>
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <input
                    type="date"
                    value={rangoFecha.desde}
                    onChange={(e) =>
                      setRangoFecha((prev) => ({
                        ...prev,
                        desde: e.target.value,
                      }))
                    }
                    className="px-3 py-1 border border-gray-300 rounded text-md"
                  />
                  <span className="text-gray-400 text-sm">-</span>
                  <input
                    type="date"
                    value={rangoFecha.hasta}
                    onChange={(e) =>
                      setRangoFecha((prev) => ({
                        ...prev,
                        hasta: e.target.value,
                      }))
                    }
                    className="px-3 py-1 border border-gray-300 rounded text-md"
                  />
                </div>
                {(rangoFecha.desde || rangoFecha.hasta) && (
                  <button
                    onClick={() => setRangoFecha({ desde: "", hasta: "" })}
                    className="text-sm text-orange-600 hover:text-orange-700 underline"
                  >
                    Limpiar fechas
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Resultados de búsqueda */}
          {busqueda && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {facturasFiltradas.length} resultado{facturasFiltradas.length !== 1 ? 's' : ''} 
                para "{busqueda}"
              </p>
            </div>
          )}

          {/* Lista de facturas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {facturasPaginadas.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {busqueda || rangoFecha.desde || rangoFecha.hasta ? (
                  <>
                    <div className="mb-2">🔍</div>
                    <p>No se encontraron facturas con los filtros aplicados</p>
                    <button
                      onClick={() => {
                        setBusqueda("");
                        setRangoFecha({ desde: "", hasta: "" });
                      }}
                      className="mt-2 text-orange-600 hover:text-orange-700 underline text-sm"
                    >
                      Limpiar filtros
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-2">📋</div>
                    <p>No hay facturas registradas</p>
                  </>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {facturasPaginadas.map((factura, index) => (
                  <Link
                    to={`/factura/${factura.id}`}
                    key={factura.id}
                    className="block hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        {/* Número de orden y contenido */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Número de orden */}
                          <div className="text-sm text-gray-500 w-8 text-center">
                            {inicio + index + 1}
                          </div>

                          {/* Icono de factura */}
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Información de la factura */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900 truncate">
                                  #{factura.id.toString().padStart(4, "0")}
                                </div>
                                <div className="text-sm text-gray-500 truncate">
                                  {factura.clientes?.cliente && (
                                    <span className="block">{factura.clientes.cliente}</span>
                                  )}
                                  <span className="text-xs">
                                    {factura.clientes?.negocio || "CAFETERIA DELICIAS CST"}
                                  </span>
                                </div>
                              </div>

                              {/* Precio y fecha */}
                              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                <div className="text-right">
                                  <div className="text-sm font-semibold text-gray-900">
                                    ${factura.total.toLocaleString("es-CO")}
                                  </div>
                                  <div className="text-xs text-gray-500 sm:hidden">
                                    {factura.fecha}
                                  </div>
                                </div>

                                {/* Flecha */}
                                <div className="flex-shrink-0">
                                  <svg
                                    className="w-4 h-4 text-gray-400"
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
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Paginación */}
          {facturasPaginadas.length > 0 && (
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
                  {Math.min(inicio + itemsPorPagina, facturasFiltradas.length)} de{" "}
                  {facturasFiltradas.length}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                    disabled={paginaActual === 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() =>
                      setPaginaActual(Math.min(totalPaginas, paginaActual + 1))
                    }
                    disabled={paginaActual === totalPaginas}
                    disabled={totalPaginas <= 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Botón de actualizar (flotante en móvil) */}
          <button
            onClick={handleActualizar}
            className="fixed bottom-4 right-4 lg:static lg:mt-4 lg:inline-flex bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg lg:shadow-none transition-colors duration-150 cursor-pointer"
          >
            <span className="lg:inline hidden">🔃 Actualizar</span>
            <span className="lg:hidden">🔃</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default HistorialFacturas;