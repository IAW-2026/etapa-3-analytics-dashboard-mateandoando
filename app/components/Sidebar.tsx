"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/compras", label: "Resumen de compras" },
  { href: "/ventas", label: "Resumen de ventas" },
  { href: "/envios", label: "Resumen de envíos" },
  { href: "/pagos", label: "Resumen de pagos" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const activeClass =
    "block px-4 py-3 rounded-xl bg-[#e6f2dc] text-[#1E3F20] font-bold text-sm transition-colors border border-[#cbe1bc]";
  const inactiveClass =
    "block px-4 py-2.5 rounded-xl text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 font-medium text-sm transition-colors";

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 hidden md:flex flex-col">
      <div className="p-6 border-b border-zinc-100">
        <h2
          className="text-[#1E3F20] font-bold text-xl tracking-tight"
          style={{ fontFamily: "Georgia, serif" }}
        >
          MateandoAndo
        </h2>
        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">
          Analytics
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <Link
          href="/"
          className={pathname === "/" ? activeClass : inactiveClass}
        >
          Dashboard General
        </Link>

        <div className="pt-4 pb-2 px-4">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Reportes por Módulo
          </span>
        </div>

        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={pathname === href ? activeClass : inactiveClass}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
