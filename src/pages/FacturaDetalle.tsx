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
                      <p className="text-sm print:text-xs">Bogotá - Colombia</p>
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
                {/* Información de la empresa y cliente */}
                <div className="mb-4 print:grid-cols-2 print:gap-4 print:mb-3">
                  {/* Información del cliente */}
                  <div>
                    <h3 className="font-semibold text-black mb-1 text-sm print:text-black print:text-xs">
                      Factura para:
                    </h3>
                    <div className="text-xs text-black p-2 bg-gray-50 rounded-md print:bg-transparent print:p-0 print:text-black print:text-[10px]">
                      {/* Tabla de información del cliente */}
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
                              {item.productos.descripcion}
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
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default FacturaDetalle;
