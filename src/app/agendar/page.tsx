"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Clock,
    FileText,
    CheckCircle2,
    Wind,
    Leaf,
    LayoutTemplate
} from "lucide-react";
import Link from "next/link";
import { crearCita } from "@/lib/actions/citas";
import { useAuth } from "@/lib/hooks/useAuth";

// Servicios y Precios definidos
const SERVICIOS = [
    {
        id: "organizacion_cocina",
        nombre: "Organización de Cocina",
        precio: 80000,
        icon: LayoutTemplate,
        duracion: 120 // 2 horas
    },
    {
        id: "consultoria_feng_shui",
        nombre: "Consultoría Feng Shui Online",
        precio: 90000,
        icon: Wind,
        duracion: 60 // 1 hora sesión
    },
    {
        id: "detox_closet",
        nombre: "Detox de Clóset",
        precio: 95000,
        icon: Leaf,
        duracion: 180 // 3 horas
    }
];

import { Suspense } from "react";

function AgendarContent() {
    const router = useRouter();
    const { user, profile } = useAuth();
    const searchParams = useSearchParams();

    // Si viene preseleccionado desde la home (opcional)
    const servicioPreseleccionado = searchParams.get("servicio") || "organizacion_cocina";

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        servicioId: servicioPreseleccionado,
        clienteNombre: "",
        clienteTelefono: "",
        clienteEmail: "",
        direccion: "",
        ciudad: "Bogotá",
        tipoPropiedad: "apartamento", // Default safe value
        fechaCita: "",
        horaCita: "",
        detallesAdicionales: "",
    });

    // Auto-fill
    useEffect(() => {
        if (user || profile) {
            setFormData(prev => ({
                ...prev,
                clienteNombre: profile?.nombre || user?.name || "",
                clienteEmail: profile?.email || user?.email || "",
                clienteTelefono: profile?.telefono || "",
                direccion: profile?.direccion || "",
                ciudad: profile?.ciudad || "Bogotá",
            }));
        }
    }, [user, profile]);

    const servicioSeleccionado = useMemo(() =>
        SERVICIOS.find(s => s.id === formData.servicioId) || SERVICIOS[0]
        , [formData.servicioId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validación básica
        if (!formData.fechaCita || !formData.horaCita) {
            setError("Por favor selecciona fecha y hora.");
            return;
        }

        setLoading(true);

        try {
            // Backend now handles both client AND address creation automatically
            const response = await crearCita({
                ...formData,
                tipoPropiedad: formData.tipoPropiedad as any, // Cast to any or correct Enum to avoid TS strict error with string state
                duracionEstimada: servicioSeleccionado.duracion,
                precioCliente: servicioSeleccionado.precio,
                metodoPago: "por_cobrar" as any,
                clienteId: profile?.$id,
            });

            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/portal/dashboard?refresh=" + Date.now());
                }, 4000);
            } else {
                setError(response.error || "Error al crear la cita");
            }
        } catch (err: any) {
            setError(err.message || "Error al agendar el servicio");
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, title: "Servicio", icon: Wind },
        { number: 2, title: "Datos", icon: User },
        { number: 3, title: "Agenda", icon: Calendar },
    ];

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
                <Card className="max-w-md w-full text-center border-none shadow-2xl bg-white">
                    <CardContent className="pt-12 pb-12">
                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-3xl font-light text-gray-900 mb-3">¡Reserva Confirmada!</h2>
                        <p className="text-gray-600 mb-8 font-light">
                            Gracias por confiar en Minimal Living. Hemos recibido tu solicitud y te contactaremos en breve para coordinar detalles.
                        </p>
                        <div className="text-sm text-gray-400">
                            Redirigiendo a tu espacio personal...
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 font-sans selection:bg-secondary/30 pb-12">

            {/* Header Simple */}
            <header className="bg-white border-b border-stone-200 py-6 sticky top-0 z-10">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Volver a Inicio</span>
                    </Link>
                    <p className="text-lg font-light text-gray-900">Agendar <span className="font-bold">Experiencia</span></p>
                    <div className="w-20"></div> {/* Spacer */}
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Progress */}
                <div className="flex justify-center mb-12">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isActive = currentStep >= step.number;
                        return (
                            <div key={step.number} className="flex items-center">
                                <div className={`flex flex-col items-center mx-4 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${isActive ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-transparent text-gray-400'}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs uppercase tracking-widest font-medium text-gray-500">{step.title}</span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`w-12 h-px ${currentStep > step.number ? 'bg-primary' : 'bg-gray-300'}`}></div>
                                )}
                            </div>
                        )
                    })}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna Izquierda: Formulario */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Selección de Servicio */}
                            <Card className="border-none shadow-sm bg-white overflow-hidden" onClick={() => setCurrentStep(1)}>
                                <CardHeader className="bg-stone-100/50 pb-4">
                                    <CardTitle className="text-xl font-light flex items-center gap-3">
                                        <Wind className="w-5 h-5 text-primary" />
                                        Selecciona tu Experiencia
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 grid grid-cols-1 gap-4">
                                    {SERVICIOS.map((servicio) => {
                                        const SIcon = servicio.icon;
                                        const isSelected = formData.servicioId === servicio.id;
                                        return (
                                            <div
                                                key={servicio.id}
                                                className={`cursor-pointer rounded-lg border p-4 flex items-center justify-between transition-all ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-100 hover:border-gray-300'}`}
                                                onClick={() => setFormData({ ...formData, servicioId: servicio.id })}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                        <SIcon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className={`font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>{servicio.nombre}</h4>
                                                        <p className="text-xs text-gray-500">{servicio.duracion < 60 ? '1 hora' : servicio.duracion / 60 + ' horas aprox.'}</p>
                                                    </div>
                                                </div>
                                                <span className="font-semibold text-gray-900">${servicio.precio.toLocaleString()}</span>
                                            </div>
                                        )
                                    })}
                                </CardContent>
                            </Card>

                            {/* Datos Personales */}
                            <Card className="border-none shadow-sm bg-white" onClick={() => setCurrentStep(2)}>
                                <CardHeader className="bg-stone-100/50 pb-4">
                                    <CardTitle className="text-xl font-light flex items-center gap-3">
                                        <User className="w-5 h-5 text-primary" />
                                        Tus Datos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Nombre Completo</Label>
                                        <Input
                                            value={formData.clienteNombre}
                                            onChange={(e) => setFormData({ ...formData, clienteNombre: e.target.value })}
                                            required
                                            className="bg-stone-50 border-stone-200"
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Teléfono</Label>
                                        <Input
                                            value={formData.clienteTelefono}
                                            onChange={(e) => setFormData({ ...formData, clienteTelefono: e.target.value })}
                                            required
                                            type="tel"
                                            className="bg-stone-50 border-stone-200"
                                            placeholder="300 000 0000"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Email</Label>
                                        <Input
                                            value={formData.clienteEmail}
                                            onChange={(e) => setFormData({ ...formData, clienteEmail: e.target.value })}
                                            required
                                            type="email"
                                            className="bg-stone-50 border-stone-200"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Ubicación y Fecha */}
                            <Card className="border-none shadow-sm bg-white" onClick={() => setCurrentStep(3)}>
                                <CardHeader className="bg-stone-100/50 pb-4">
                                    <CardTitle className="text-xl font-light flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        ¿Cuándo y Dónde?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Ciudad</Label>
                                            <Input
                                                value={formData.ciudad}
                                                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                                                required
                                                className="bg-stone-50 border-stone-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tipo Espacio</Label>
                                            <select
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={formData.tipoPropiedad}
                                                onChange={(e) => setFormData({ ...formData, tipoPropiedad: e.target.value })}
                                            >
                                                <option value="apartamento">Apartamento</option>
                                                <option value="casa">Casa</option>
                                                <option value="oficina">Oficina</option>
                                                <option value="local">Local</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Dirección</Label>
                                        <Input
                                            value={formData.direccion}
                                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                            required
                                            className="bg-stone-50 border-stone-200"
                                            placeholder="Dirección exacta"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Fecha</Label>
                                            <Input
                                                value={formData.fechaCita}
                                                onChange={(e) => setFormData({ ...formData, fechaCita: e.target.value })}
                                                required
                                                type="date"
                                                min={new Date().toISOString().split("T")[0]}
                                                className="bg-stone-50 border-stone-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Hora</Label>
                                            <Input
                                                value={formData.horaCita}
                                                onChange={(e) => setFormData({ ...formData, horaCita: e.target.value })}
                                                required
                                                type="time"
                                                className="bg-stone-50 border-stone-200"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Columna Derecha: Resumen */}
                        <div className="lg:col-span-1">
                            <Card className="border-none shadow-lg bg-white sticky top-24">
                                <CardHeader className="bg-primary text-white pb-6 pt-6">
                                    <CardTitle className="text-lg font-normal">Resumen de Reserva</CardTitle>
                                    <div className="mt-4">
                                        <p className="text-sm opacity-80 uppercase tracking-widest">Total a Pagar</p>
                                        <p className="text-4xl font-semibold mt-1">${servicioSeleccionado.precio.toLocaleString()}</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Servicio</span>
                                            <span className="font-medium text-gray-900 text-right w-1/2">{servicioSeleccionado.nombre}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Duración Est.</span>
                                            <span className="font-medium text-gray-900">{servicioSeleccionado.duracion / 60} horas</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-lg bg-gray-900 hover:bg-gray-800 text-white"
                                            disabled={loading}
                                        >
                                            {loading ? 'Procesando...' : 'Confirmar Reserva'}
                                        </Button>
                                        <p className="text-xs text-center text-gray-400 mt-3 font-light">
                                            No se te cobrará nada hoy. El pago se realiza al finalizar el servicio.
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                                            {error}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AgendarPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <AgendarContent />
        </Suspense>
    );
}
