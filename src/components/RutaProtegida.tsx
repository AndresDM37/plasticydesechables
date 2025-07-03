import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function RutaProtegida({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default RutaProtegida;
