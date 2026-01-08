"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function PagosLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const tabs = [
        { name: "Empleados", href: "/admin/pagos/empleados" },
        { name: "Clientes", href: "/admin/pagos/clientes" }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Pagos</h1>
                <p className="text-gray-600 mt-1">Gestión de pagos a empleados y de clientes</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                    ${isActive
                                        ? "border-primary text-primary"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }
                                `}
                            >
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div>{children}</div>
        </div>
    );
}
