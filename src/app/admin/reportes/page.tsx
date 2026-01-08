"use client";

import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    obtenerResumenFinanciero,
    obtenerEstadisticasServicios,
    obtenerRendimientoPersonal,
    obtenerMejoresClientes,
    obtenerCartera,
    obtenerEstadoNomina,
    type ReporteFinancieroMes,
    type EstadisticaServicio,
    type RendimientoEmpleado,
    type ClienteTop,
    type CarteraEstado,
    type EstadoNomina
} from "@/lib/actions/reportes";
import { formatearPrecio } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    BarChart3,
    TrendingUp,
    Users,
    DollarSign,
    Calendar,
    Wallet,
    AlertTriangle,
    Award,
    Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportesPage() {
    // State for data
    const [finanzas, setFinanzas] = useState<ReporteFinancieroMes[]>([]);
    const [servicios, setServicios] = useState<EstadisticaServicio[]>([]);
    const [personal, setPersonal] = useState<RendimientoEmpleado[]>([]);
    const [clientes, setClientes] = useState<ClienteTop[]>([]);
    const [cartera, setCartera] = useState<CarteraEstado | null>(null);
    const [nomina, setNomina] = useState<EstadoNomina | null>(null);

    // State for filters
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState<string>("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, [selectedYear, selectedMonth]);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            // Calculate date range based on filters
            const year = parseInt(selectedYear);
            let startDate: Date;
            let endDate: Date;

            if (selectedMonth === "all") {
                startDate = new Date(year, 0, 1);
                endDate = new Date(year, 11, 31, 23, 59, 59);
            } else {
                const month = parseInt(selectedMonth); // 0-11
                startDate = new Date(year, month, 1);
                endDate = new Date(year, month + 1, 0, 23, 59, 59);
            }

            const [
                finanzasData,
                serviciosData,
                personalData,
                clientesData,
                carteraData,
                nominaData
            ] = await Promise.all([
                obtenerResumenFinanciero(year), // Keeps showing full year trend usually
                obtenerEstadisticasServicios(startDate, endDate),
                obtenerRendimientoPersonal(startDate, endDate),
                obtenerMejoresClientes(startDate, endDate),
                obtenerCartera(startDate, endDate),
                obtenerEstadoNomina(startDate, endDate)
            ]);

            setFinanzas(finanzasData);
            setServicios(serviciosData);
            setPersonal(personalData);
            setClientes(clientesData);
            setCartera(carteraData);
            setNomina(nominaData);

        } catch (error) {
            console.error("Error cargando reportes:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalIngresos = finanzas.reduce((acc, curr) => acc + curr.ingresos, 0);
    const totalGastos = finanzas.reduce((acc, curr) => acc + curr.gastos, 0);
    const beneficioNeto = totalIngresos - totalGastos;
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header and Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reportes Avanzados</h1>
                    <p className="text-gray-500 mt-1">
                        Inteligencia de negocios y análisis detallado
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    <Calendar className="h-4 w-4 text-gray-400 ml-2" />

                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[140px] border-none shadow-none focus:ring-0">
                            <SelectValue placeholder="Mes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todo el Año</SelectItem>
                            {months.map((m, i) => (
                                <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="w-px h-4 bg-gray-200" />

                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[100px] border-none shadow-none focus:ring-0">
                            <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2026">2026</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            ) : (
                <>
                    {/* Advanced Financial Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-100">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold text-orange-600 uppercase tracking-widest flex items-center gap-2">
                                    <AlertTriangle className="h-3 w-3" /> Cuentas x Cobrar
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">
                                    {formatearPrecio(cartera?.totalPorCobrar || 0)}
                                </div>
                                <div className="flex justify-between items-end mt-1">
                                    <p className="text-xs text-orange-700/80">
                                        {cartera?.citasPendientesPago || 0} facturas pendientes
                                    </p>
                                    <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">
                                        {cartera?.antiguedadPromedioDias || 0} días prom.
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                    <DollarSign className="h-3 w-3" /> Facturación
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">
                                    {formatearPrecio(totalIngresos)}
                                </div>
                                <p className="text-xs text-blue-600/80 mt-1">
                                    {selectedMonth === 'all' ? 'Total anual acumulado' : `Total ${months[parseInt(selectedMonth)]}`}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-white to-violet-50 border-violet-100">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold text-violet-600 uppercase tracking-widest flex items-center gap-2">
                                    <Wallet className="h-3 w-3" /> Nómina Est.
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">
                                    {formatearPrecio(nomina?.totalGenerado || 0)}
                                </div>
                                <div className="w-full bg-violet-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="bg-violet-500 h-full rounded-full"
                                        style={{ width: `${nomina?.totalGenerado ? (nomina.totalPagado / nomina.totalGenerado) * 100 : 0}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-violet-600/80 mt-1 text-right">
                                    {nomina?.totalGenerado ? Math.round((nomina.totalPagado / nomina.totalGenerado) * 100) : 0}% Pagado
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-white to-emerald-50 border-emerald-100">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp className="h-3 w-3" /> Net Profit
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">
                                    {formatearPrecio(beneficioNeto)}
                                </div>
                                <p className="text-xs text-emerald-600/80 mt-1">
                                    Margen Neto: {totalIngresos > 0 ? ((beneficioNeto / totalIngresos) * 100).toFixed(1) : 0}%
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="bg-gray-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto justify-start">
                            <TabsTrigger value="overview" className="rounded-lg px-4">Resumen General</TabsTrigger>
                            <TabsTrigger value="clients" className="rounded-lg px-4">Mejores Clientes</TabsTrigger>
                            <TabsTrigger value="services" className="rounded-lg px-4">Servicios</TabsTrigger>
                            <TabsTrigger value="team" className="rounded-lg px-4">Desempeño Equipo</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Flujo de Caja</CardTitle>
                                            <CardDescription>Ingresos vs Gastos Mensuales</CardDescription>
                                        </CardHeader>
                                        <CardContent className="h-[400px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={finanzas}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                    <XAxis dataKey="mes" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                                    <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                                                    <Tooltip
                                                        cursor={{ fill: 'transparent' }}
                                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                        formatter={(value: any) => [formatearPrecio(value as number), ""]}
                                                    />
                                                    <Legend />
                                                    <Bar dataKey="ingresos" name="Ingresos" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                                    <Bar dataKey="gastos" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">Top 3 Clientes</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {clientes.slice(0, 3).map((cliente, i) => (
                                                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                                                        {i + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{cliente.nombre}</p>
                                                        <p className="text-xs text-gray-500">{cliente.serviciosContratados} servicios</p>
                                                    </div>
                                                    <div className="font-semibold text-sm">
                                                        {formatearPrecio(cliente.totalGastado)}
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">Distribución</CardTitle>
                                        </CardHeader>
                                        <CardContent className="h-[200px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={servicios as any[]}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={40}
                                                        outerRadius={70}
                                                        paddingAngle={2}
                                                        dataKey="cantidad"
                                                    >
                                                        {servicios.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Top Clients Tab */}
                        <TabsContent value="clients" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mejores Clientes</CardTitle>
                                    <CardDescription>Clientes que más ingresos generan al negocio</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1">
                                        <div className="grid grid-cols-12 text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 border-b mb-2 px-2">
                                            <div className="col-span-1">#</div>
                                            <div className="col-span-5">Cliente</div>
                                            <div className="col-span-3 text-right">Servicios</div>
                                            <div className="col-span-3 text-right">Total Facturado</div>
                                        </div>
                                        {clientes.map((cliente, i) => (
                                            <div key={i} className="grid grid-cols-12 items-center hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                                <div className="col-span-1 font-bold text-gray-400">#{i + 1}</div>
                                                <div className="col-span-5 font-medium text-gray-900 flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                                        {cliente.nombre.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    {cliente.nombre}
                                                </div>
                                                <div className="col-span-3 text-right text-gray-600">{cliente.serviciosContratados}</div>
                                                <div className="col-span-3 text-right font-bold text-gray-900">{formatearPrecio(cliente.totalGastado)}</div>
                                            </div>
                                        ))}
                                        {clientes.length === 0 && (
                                            <div className="text-center py-10 text-gray-500">No hay datos disponibles para este periodo.</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Team Tab */}
                        <TabsContent value="team" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Productividad del Equipo</CardTitle>
                                    <CardDescription>Rendimiento basado en servicios completados e ingresos generados</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {personal.map((emp, i) => (
                                            <div key={emp.empleadoId} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                                <div className="flex items-center gap-4">
                                                    <Avatar>
                                                        <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                                                            {emp.nombre.substring(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{emp.nombre}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {emp.serviciosCompletados} servicios completados
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-semibold text-emerald-600">
                                                        Generado: {formatearPrecio(emp.totalGenerado)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Services Tab */}
                        <TabsContent value="services" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Análisis de Servicios</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={servicios} layout="vertical" margin={{ left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="nombre" type="category" width={100} tick={{ fontSize: 12 }} />
                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                            <Bar dataKey="cantidad" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={30}>
                                                {servicios.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    );
}
