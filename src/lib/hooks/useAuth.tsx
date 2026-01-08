"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { account } from "@/lib/appwrite";
import { Models } from "appwrite";
import { obtenerClientePorEmail } from "@/lib/actions/clientes";
import { obtenerEmpleadoPorEmail } from "@/lib/actions/empleados";

interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    profile: any | null; // Perfil de cliente si es rol cliente
    role: "admin" | "client" | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [role, setRole] = useState<"admin" | "client" | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const currentUser = await account.get();
            setUser(currentUser);

            // 1. Detectar si es Cliente
            const cliente = await obtenerClientePorEmail(currentUser.email);

            if (cliente) {
                setRole("client");
                setProfile(cliente);
            } else {
                // 2. Si no es cliente, verificar si es Empleado/Admin
                // IMPORTANTE: Esto evita que cualquier usuario registrado sea admin por defecto
                const empleado = await obtenerEmpleadoPorEmail(currentUser.email);

                if (empleado) {
                    setRole("admin");
                    // Por ahora el perfil admin puede ser null o el objeto empleado
                    setProfile(empleado);
                } else {
                    // 3. Si no está en ninguna lista, es un usuario sin rol (Guest/Pending)
                    // Esto previene el acceso no autorizado
                    console.warn(`Usuario ${currentUser.email} no tiene rol asignado.`);
                    setRole(null);
                    setProfile(null);
                }
            }

        } catch (error) {
            setUser(null);
            setRole(null);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            await account.createEmailPasswordSession(email, password);
            await checkAuth();
        } catch (error: any) {
            console.error("Error en login:", error);
            throw new Error(error.message || "Error al iniciar sesión");
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession("current");
            await account.deleteSession("current");
            setUser(null);
            setRole(null);
            setProfile(null);
        } catch (error: any) {
            console.error("Error en logout:", error);
            throw new Error(error.message || "Error al cerrar sesión");
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, profile, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe ser usado dentro de AuthProvider");
    }
    return context;
}
