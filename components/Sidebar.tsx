"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/technologies", label: "行业减排技术查询" },
  { href: "/plans", label: "减排路径规划" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen w-[220px] flex flex-col bg-white border-r border-border"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex h-16 items-center border-b border-border px-6">
        <span className="text-lg font-semibold text-primary">碳减排平台</span>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-md px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-primary-light text-primary font-medium"
                      : "text-text-secondary hover:bg-bg hover:text-primary-dark"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
