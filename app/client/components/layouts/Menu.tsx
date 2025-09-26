// path: app/client/components/layouts/Menu.tsx
// Neumorphic вертикальное меню навигации со ссылками на основные разделы.

import React from "react";
import { NavLink } from "react-router-dom";

import { cn } from "../../lib/utils";

const links = [
  { to: "/", label: "Главная" },
  { to: "/search", label: "Поиск" },
  { to: "/history", label: "История" },
  { to: "/calculator", label: "Калькулятор" },
  { to: "/logs", label: "Логи" },
];

const Menu: React.FC = () => (
  <nav>
    <ul className="space-y-2">
      {links.map(({ to, label }) => (
        <li key={to}>
          <NavLink
            to={to}
            className={({ isActive }) =>
              cn(
                "block px-3 py-2 rounded-md transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )
            }
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

export { Menu };
