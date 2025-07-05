import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ListaProductos from "./pages/ListaProductos";
import NuevaFactura from "./pages/NuevaFactura";
import HistorialFacturas from "./pages/HistorialFacturas";
import FacturaDetalle from "./pages/FacturaDetalle";
import ListaClientes from "./pages/ListaClientes";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RecuperarContraseña from "./pages/RecuperarContraseña";
import NuevaClave from "./pages/NuevaClave";
import RutaProtegida from "./components/RutaProtegida";
import ResumenHoy from "./pages/ResumenHoy";

function App() {
  return (
    <Routes>
      <Route path="/registro" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar" element={<RecuperarContraseña />} />
      <Route path="/nueva-clave" element={<NuevaClave />} />
      <Route
        path="/"
        element={
          <RutaProtegida>
            <Home />
          </RutaProtegida>
        }
      />
      <Route
        path="/productos"
        element={
          <RutaProtegida>
            <ListaProductos />
          </RutaProtegida>
        }
      />
      <Route
        path="/clientes"
        element={
          <RutaProtegida>
            <ListaClientes />
          </RutaProtegida>
        }
      />
      <Route
        path="/crear-factura"
        element={
          <RutaProtegida>
            <NuevaFactura />
          </RutaProtegida>
        }
      />
      <Route
        path="/factura/editar/:id"
        element={
          <RutaProtegida>
            <NuevaFactura />
          </RutaProtegida>
        }
      />
      <Route
        path="/ver-facturas"
        element={
          <RutaProtegida>
            <HistorialFacturas />
          </RutaProtegida>
        }
      />
      <Route
        path="/factura/:id"
        element={
          <RutaProtegida>
            <FacturaDetalle />
          </RutaProtegida>
        }
      />
      <Route path="/resumen-hoy" element={<ResumenHoy />} />
    </Routes>
  );
}

export default App;
