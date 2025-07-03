import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Layout from "./Layout";
import { obtenerFacturaConDetalle } from "../utils/historial";
import type { DetalleFactura } from "../types/index";

function FacturaDetalle() {
  const { id } = useParams();
  const [factura, setFactura] = useState<DetalleFactura | null>(null);

  useEffect(() => {
    if (id) {
      obtenerFacturaConDetalle(Number(id)).then(setFactura);
    }
  }, [id]);

  const componenteRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componenteRef,
    documentTitle: `Factura_${factura?.id}`,
  });

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
          {/* Header con botón de imprimir */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                Detalle de Factura #{factura.id.toString().padStart(4, "0")}
              </h1>
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
            </div>
          </div>

          {/* Factura para imprimir */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div
              ref={componenteRef}
              className="print:shadow-none max-h-screen print:max-h-none overflow-auto print:overflow-visible"
            >
              <div className="bg-orange-500 print:bg-gradient-to-r print:from-orange-500 print:to-white p-2 lg:p-3 print:bg-orange-500 print:p-4">
                <div className="flex justify-between items-center text-white">
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
                    <div className="text-md lg:text-sm text-gray-800 font-bold space-y-0.5 print:text-sm">
                      <p className="font-medium">OP Plasticos y Desechables</p>
                      <p>52081219-2</p>
                      <p>(57) 3133649085</p>
                      <p>Bogotá - Colombia</p>
                      <p>opplasticosydesechables@gmail.com</p>
                    </div>
                  </div>
                  <div className="text-right text-gray-800 font-bold">
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
                {/* Información de la empresa y cliente */}
                <div className="mb-4 print:grid-cols-2 print:gap-4 print:mb-3">
                  {/* Información del cliente */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm print:text-black print:text-xs">
                      Factura para:
                    </h3>
                    <div className="text-xs text-gray-600 space-y-0.5 p-2 bg-gray-50 rounded-md print:bg-transparent print:p-0 print:text-black print:text-[10px]">
                      Señores: <p className="font-medium">{factura.clientes.negocio}</p>
                      <p>{factura.clientes.cliente}</p>
                      <p>Tel: {factura.clientes.telefono}</p>
                      <p>{factura.clientes.direccion}</p>
                    </div>
                  </div>
                </div>

                {/* Tabla de productos - Responsiva según cantidad */}
                <div className="mb-4 print:mb-3">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm print:text-black print:text-xs print:mb-1">
                    Productos:
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px] print:min-w-0">
                      <thead>
                        <tr className="bg-gray-800 text-white print:bg-gray-800 print:text-white">
                          <th className="px-2 py-2 text-left font-medium text-xs print:text-[10px]">
                            Ítem
                          </th>
                          <th
                            className={`px-2 py-2 text-left font-medium ${
                              factura.items_factura.length > 15
                                ? "text-xs print:text-[10px]"
                                : factura.items_factura.length > 10
                                ? "text-xs print:text-[10px]"
                                : "text-sm print:text-[10px]"
                            }`}
                          >
                            Cant
                          </th>
                          <th
                            className={`px-2 py-2 text-left font-medium ${
                              factura.items_factura.length > 15
                                ? "text-xs print:text-[10px]"
                                : factura.items_factura.length > 10
                                ? "text-xs print:text-[10px]"
                                : "text-sm print:text-[10px]"
                            }`}
                          >
                            Producto
                          </th>
                          <th
                            className={`px-2 py-2 text-left font-medium ${
                              factura.items_factura.length > 15
                                ? "text-xs print:text-[10px]"
                                : factura.items_factura.length > 10
                                ? "text-xs print:text-[10px]"
                                : "text-sm print:text-[10px]"
                            }`}
                          >
                            Vr.Unit
                          </th>
                          <th
                            className={`px-2 py-2 text-left font-medium ${
                              factura.items_factura.length > 15
                                ? "text-xs print:text-[10px]"
                                : factura.items_factura.length > 10
                                ? "text-xs print:text-[10px]"
                                : "text-sm print:text-[10px]"
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
                            <td className="px-2 py-2 text-sm print:text-[10px]">{i + 1}</td>
                            <td
                              className={`px-2 ${
                                factura.items_factura.length > 15
                                  ? "py-0.5 text-xs print:text-[10px] print:py-0"
                                  : factura.items_factura.length > 10
                                  ? "py-1 text-xs print:text-[10px] print:py-0.5"
                                  : "py-2 text-sm print:text-[10px] print:py-1"
                              }`}
                            >
                              {item.cantidad}
                            </td>
                            <td
                              className={`px-2 ${
                                factura.items_factura.length > 15
                                  ? "py-0.5 text-xs print:text-[10px] print:py-0"
                                  : factura.items_factura.length > 10
                                  ? "py-1 text-xs print:text-[10px] print:py-0.5"
                                  : "py-2 text-sm print:text-[10px] print:py-1"
                              }`}
                            >
                              {item.productos.descripcion}
                            </td>
                            <td
                              className={`px-2 ${
                                factura.items_factura.length > 15
                                  ? "py-0.5 text-xs print:text-[10px] print:py-0"
                                  : factura.items_factura.length > 10
                                  ? "py-1 text-xs print:text-[10px] print:py-0.5"
                                  : "py-2 text-sm print:text-[10px] print:py-1"
                              }`}
                            >
                              ${item.precio_unitario.toLocaleString("es-CO")}
                            </td>
                            <td
                              className={`px-2 font-medium ${
                                factura.items_factura.length > 15
                                  ? "py-0.5 text-xs print:text-[10px] print:py-0"
                                  : factura.items_factura.length > 10
                                  ? "py-1 text-xs print:text-[10px] print:py-0.5"
                                  : "py-2 text-sm print:text-[10px] print:py-1"
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

                {/* Términos y Total */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 print:grid-cols-2 print:gap-4">
                  {/* Términos y Condiciones */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm print:text-black print:text-xs">
                      Términos & Condiciones
                    </h4>
                    <div className="text-[10px] text-gray-600 space-y-0.5 print:text-black print:text-[8px]">
                      <p>
                        ESTE DOCUMENTO ES UNA NOTA COMERCIAL PARA EFECTOS DE USO
                        INTERNO DEL CONTRIBUYENTE.
                      </p>
                      <p>
                        LOS EFECTOS QUE EFECTOS SE USA DEBEN QUE EFECTOS SE USA
                        DEBEN
                      </p>
                      <p>ESTAR TOTALMENTE LLENOS O VACIOS.</p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="text-right">
                    <div className="bg-gray-800 text-white p-3 rounded-lg print:bg-gray-800 print:text-white print:rounded-none print:p-2">
                      <div className="text-sm font-semibold mb-1 print:text-xs">
                        TOTAL A PAGAR
                      </div>
                      <div className="text-xl font-bold print:text-lg">
                        ${factura.total.toLocaleString("es-CO")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información adicional para impresión */}
                <div className="mt-4 pt-3 border-t border-gray-200 print:block print:mt-3 print:pt-2">
                  <div className="text-center text-[10px] text-gray-500 print:text-black print:text-[8px]">
                    <p>Gracias por su compra - Plasticos y Desechables</p>
                    <p className="mt-0.5">
                      www.plasticosydesechables.com | Tel: (57) 3133649085
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default FacturaDetalle;
