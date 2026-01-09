"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, Lock, User, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { crearCliente } from "@/lib/actions/clientes";
import { TipoCliente, FrecuenciaCliente } from "@/types";
import { account } from "@/lib/appwrite";
import { ID } from "appwrite";

export default function RegistroPage() {
    const router = useRouter(); // Initialize router properly even if handled by auth logic
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        password: "",
        direccion: "",
        ciudad: "Bogotá",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await account.create(ID.unique(), formData.email, formData.password, formData.nombre);

            await crearCliente({
                nombre: formData.nombre,
                email: formData.email,
                telefono: formData.telefono,
                direccion: formData.direccion,
                ciudad: formData.ciudad,
                tipoCliente: TipoCliente.RESIDENCIAL,
                frecuenciaPreferida: FrecuenciaCliente.UNICA,
            });

            await login(formData.email, formData.password);

            // Force redirect to dashboard
            router.push("/portal/dashboard");

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error al registrarse. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center animate-fade-in">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
                        Únete a Minimal Living
                    </h1>
                    <p className="mt-2 text-stone-600">
                        Regístrate y recibe un <span className="font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">10% OFF</span> en tu primer servicio
                    </p>
                </div>

                <Card className="border-stone-200 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-center text-stone-800">Crear Cuenta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                                        <Input
                                            id="nombre"
                                            placeholder="Nombre"
                                            className="pl-9 bg-stone-50 border-stone-200"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telefono">Teléfono</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                                        <Input
                                            id="telefono"
                                            placeholder="300..."
                                            className="pl-9 bg-stone-50 border-stone-200"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        className="pl-9 bg-stone-50 border-stone-200"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Mínimo 8 caracteres"
                                        className="pl-9 bg-stone-50 border-stone-200"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="direccion">Dirección</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                                    <Input
                                        id="direccion"
                                        placeholder="Dirección principal"
                                        className="pl-9 bg-stone-50 border-stone-200"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 transition-all"
                                disabled={loading}
                            >
                                {loading ? "Creando cuenta..." : "Registrarse y Obtener Descuento"}
                            </Button>
                        </form>
                        <p className="text-center text-sm text-stone-600 mt-6">
                            ¿Ya tienes cuenta? <Link href="/login" className="text-secondary hover:underline font-semibold">Inicia Sesión</Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
