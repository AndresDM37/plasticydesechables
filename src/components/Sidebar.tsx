import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const [activeItem, setActiveItem] = useState("home");

  const navigate = useNavigate();

  const nombre = user?.user_metadata?.nombres || "NOMBRE DE USUARIO";

  const menuItems = [
    {
      id: "crear-factura",
      label: "Crear Nueva Factura",
      icon: "📄",
      href: "/crear-factura",
      className: "cursor-pointer",
    },
    {
      id: "ver-facturas",
      label: "Ver facturas anteriores",
      icon: "📋",
      href: "/ver-facturas",
    },
    {
      id: "catalogo-productos",
      label: "Ver o crear catálogo de productos",
      icon: "📦",
      href: "/productos",
    },
    {
      id: "catalogo-clientes",
      label: "Ver o crear catálogo de clientes",
      icon: "👥",
      href: "/clientes",
    },
  ];

  const handleItemClick = (itemId, href) => {
    setActiveItem(itemId);
    navigate(href);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div className="fixed inset-0 z-20 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-30 
        w-80 bg-gradient-to-b from-orange-500 to-orange-600 text-white 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col h-screen
      `}
      >
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-orange-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <img
                  src="/assets/images/image.png"
                  alt="icono"
                  className="w-[200px]"
                />
              </div>
            </div>
            {/* Botón cerrar en móvil */}
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:text-orange-200 p-2"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 lg:p-6 border-b border-orange-400">
          <p className="text-orange-100 text-xs lg:text-sm uppercase tracking-wide mb-2">
            {nombre}
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id, item.href)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeItem === item.id
                      ? "bg-orange-400 bg-opacity-50"
                      : "hover:bg-orange-400 hover:bg-opacity-30"
                  }`}
                >
                  <span className="text-lg lg:text-xl">{item.icon}</span>
                  <span className="text-xs lg:text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Home Button */}
        <div className="p-4 border-t border-orange-400">
          <button
            onClick={() => handleItemClick("home", "/")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
              activeItem === "home"
                ? "bg-orange-400 bg-opacity-50"
                : "hover:bg-orange-400 hover:bg-opacity-30"
            }`}
          >
            <span className="text-lg lg:text-xl">🏠</span>
            <span className="text-xs lg:text-sm">Inicio</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
