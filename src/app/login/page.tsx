"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const { login, role, loading: authLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Efecto para redireccionar cuando el rol se detecta
    useEffect(() => {
        if (!authLoading && role) {
            if (role === "admin") {
                router.push("/admin");
            } else if (role === "client") {
                router.push("/portal/dashboard");
            }
        }
    }, [role, router, authLoading]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-emerald-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            // La redirección es manejada por el useEffect
        } catch (err: any) {
            setError(err.message || "Error al iniciar sesión");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                {/* Logo y título */}
                <div className="text-center animate-fade-in">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
                        Minimal Living
                    </h1>
                    <p className="mt-2 text-stone-600">
                        Bienvenido de nuevo
                    </p>
                </div>

                {/* Card de login */}
                <Card className="border-stone-200 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-center text-stone-800">Iniciar Sesión</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        className="pl-9 bg-stone-50 border-stone-200"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Contraseña</Label>
                                    {/* <a href="#" className="text-xs text-secondary hover:underline font-medium">
                                        ¿Olvidaste tu contraseña?
                                    </a> */}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-9 bg-stone-50 border-stone-200"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-md flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                    <p className="text-sm font-medium text-red-600">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 transition-all"
                                disabled={loading}
                            >
                                {loading ? "Ingresando..." : "Iniciar Sesión"}
                            </Button>
                        </form>
                        <p className="text-center text-sm text-stone-600 mt-6">
                            ¿No tienes cuenta? <Link href="/registro" className="text-secondary hover:underline font-semibold">Regístrate gratis</Link>
                        </p>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-stone-400 mt-8">
                    © 2026 Minimal Living. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}
