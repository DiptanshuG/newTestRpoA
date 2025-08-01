import { BarChart3, MessageSquare, Package, Settings, ShoppingCart, Users } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: <BarChart3 size={20} />, text: "Dashboard", to: "/dashboard" },
    { icon: <Users size={20} />, text: "Sellers", to: "/sellers" },
    { icon: <Package size={20} />, text: "Master Catalog", to: "/mastercatalog" },
    { icon: <ShoppingCart size={20} />, text: "Orders", to: "/orders" },
    { icon: <MessageSquare size={20} />, text: "Support", to: "/support" },
    { icon: <Settings size={20} />, text: "Settings", to: "/settings" },
  ];

  return (
    <div className="w-64 border-r border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">MestoKart Admin</h1>
      </div>
      <nav className="mt-2">
        {navItems.map((item, index) => (
          <NavItem key={index} icon={item.icon} text={item.text} to={item.to} active={location.pathname === item.to} />
        ))}
      </nav>
    </div>
  );
};

const NavItem = ({ icon, text, to, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 ${active ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </Link>
  );
};

export default Sidebar;
