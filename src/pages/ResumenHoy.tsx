// pages/ResumenHoy.tsx
import { useEffect, useState } from "react";
import { obtenerFacturasDelDia } from "../utils/historialHoy";
import Layout from "./Layout"; // O ajústalo si usas otro layout
import type { Factura } from "../types";

function ResumenHoy() {
  const [facturasHoy, setFacturasHoy] = useState<Factura[]>([]);
  const [totalDelDia, setTotalDelDia] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarFacturas = async () => {
      try {
        setCargando(true);
        const data = await obtenerFacturasDelDia();
        setFacturasHoy(data);
        const total = data.reduce((acc, f) => acc + f.total, 0);
        setTotalDelDia(total);
      } catch (error) {
        console.error("Error al cargar facturas:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarFacturas();
  }, []);

  const handleActualizar = async () => {
    const data = await obtenerFacturasDelDia();
    setFacturasHoy(data);
    const total = data.reduce((acc, f) => acc + f.total, 0);
    setTotalDelDia(total);
  };

  // Obtener fecha actual formateada
  const fechaHoy = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (cargando) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando resumen...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 lg:p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">
                  📅 Resumen de Ventas
                </h1>
                <p className="text-sm text-gray-600 capitalize">{fechaHoy}</p>
              </div>
              <button
                onClick={handleActualizar}
                className="mt-4 sm:mt-0 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-150 text-sm font-medium"
              >
                🔃 Actualizar
              </button>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="flex justify-center md:grid-cols-3 gap-4 mb-6">
            {/* Total del día */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-opacity-20 rounded-lg">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">
                    Total Facturado
                  </p>
                  <p className="text-2xl font-bold">
                    ${totalDelDia.toLocaleString("es-CO")}
                  </p>
                </div>
              </div>
            </div>

            {/* Número de facturas */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-opacity-20 rounded-lg mr-3">
                  <svg
                    className="w-10 h-10"
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
                <div>
                  <p className="text-sm font-medium opacity-90">Facturas</p>
                  <p className="text-2xl font-bold">{facturasHoy.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de facturas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Facturas del Día
              </h2>
            </div>

            {facturasHoy.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700">
                  No hay facturas hoy
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Las facturas que crees aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Factura
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Negocio
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {facturasHoy.map((factura, index) => (
                      <tr
                        key={factura.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-orange-600">
                                {index + 1}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                #{factura.id.toString().padStart(4, "0")}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {factura.clientes?.cliente || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {factura.clientes?.negocio}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            ${factura.total.toLocaleString("es-CO")}
                          </div>
                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Resumen final */}
          {facturasHoy.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                  <span className="font-medium">{facturasHoy.length}</span>{" "}
                  facturas procesadas hoy
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Total del día: </span>
                  <span className="text-lg font-bold text-green-600">
                    ${totalDelDia.toLocaleString("es-CO")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ResumenHoy;
