import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle, Phone, Mail, Clock, Shield, Leaf, Wind, LayoutTemplate, Star, MessageCircle, Calendar } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { MarketingNavbar } from "@/components/layout/marketing-navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans selection:bg-secondary/30">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_minimal_living.png"
            alt="Espacio minimalista y organizado con Feng Shui"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/40 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl text-white">
            <Badge className="mb-6 bg-primary/80 backdrop-blur-sm border-none text-white text-sm tracking-widest uppercase px-4 py-2">
              Organización & Feng Shui
            </Badge>
            <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
              Minimal <span className="font-bold">Living</span>
              <span className="block text-3xl md:text-5xl mt-2 font-light opacity-90">Simplifica tu Espacio, Eleva tu Vida</span>
            </h1>
            <p className="text-xl opacity-90 mb-10 leading-relaxed max-w-2xl font-light">
              Creamos armonía en tu hogar a través del orden consciente y la sabiduría del Feng Shui.
              Espacios que respiran, diseñados para tu bienestar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link href="/agendar" className="w-full sm:w-auto">
                <Button size="lg" className="w-full text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white border-none shadow-lg rounded-none transition-all duration-300">
                  <Wind className="mr-3 h-5 w-5" />
                  Agendar Consultoría
                </Button>
              </Link>

              <Link href="#servicios" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-white/10 hover:text-white rounded-none backdrop-blur-sm transition-all duration-300">
                  Explorar Servicios
                </Button>
              </Link>

              <Link href="/registro" className="w-full sm:w-auto">
                <Button size="lg" className="w-full text-lg px-8 py-6 bg-secondary hover:bg-secondary/90 text-white border-none shadow-lg rounded-none transition-all duration-300 animate-pulse hover:animate-none">
                  <Sparkles className="mr-3 h-5 w-5" />
                  Regístrate -10% OFF
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-accent text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <Leaf className="h-10 w-10 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-6">
            "El orden externo refleja y promueve el orden interno."
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed font-light">
            En Minimal Living, no solo organizamos objetos; transformamos la energía de tu hogar.
            Utilizamos principios de Feng Shui y minimalismo para crear ambientes que reducen el estrés
            y potencian tu claridad mental. Menos cosas, más significado.
          </p>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-secondary font-medium tracking-widest uppercase text-sm">Nuestros Servicios</span>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mt-2 mb-4">
              Armonía a tu Alcance
            </h2>
            <p className="text-lg text-gray-500 font-light">
              Soluciones profesionales por menos de $100.000
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                image: "/images/kitchen_minimal.png",
                title: "Organización de Cocina",
                price: "$80.000",
                duration: "2 Horas",
                desc: "Optimizamos tu despensa y superficies para un flujo de energía perfecto y funcionalidad diaria.",
                features: ["Despensa categorizada", "Etiquetado estético", "Limpieza energética", "Optimización de flujo"],
              },
              {
                image: "/images/closet_minimal.png",
                title: "Detox de Clóset",
                price: "$95.000",
                duration: "3 Horas",
                desc: "Renueva tu energía soltando lo que no usas. Organización por color y categoría estilo boutique.",
                features: ["Selección consciente", "Doblado vertical", "Organización por color", "Maximilización de espacio"],
              },
              {
                image: "/images/feng_shui_consult.png",
                title: "Consultoría Feng Shui Online",
                price: "$90.000",
                duration: "Sesión Virtual",
                desc: "Análisis energético de tu espacio principal para atraer abundancia, salud y armonía.",
                features: ["Análisis de mapa Bagua", "Recomendación de curas", "Equilibrio de elementos", "Informe digital PDF"],
              },
            ].map((servicio, i) => (
              <Card key={i} className="group border-0 shadow-none hover:shadow-xl transition-all duration-500 rounded-none bg-neutral-50 overflow-hidden">
                <div className="relative h-72 overflow-hidden bg-gray-200">
                  <Image
                    src={servicio.image}
                    alt={servicio.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                </div>
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <CardTitle className="text-2xl font-light text-gray-900">{servicio.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <Badge variant="secondary" className="rounded-none font-normal bg-secondary/10 text-secondary hover:bg-secondary/20 border-none">
                      {servicio.price}
                    </Badge>
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {servicio.duration}</span>
                  </div>
                  <p className="text-gray-600 font-light text-sm leading-relaxed">{servicio.desc}</p>
                </CardHeader>
                <CardContent className="p-8 pt-2">
                  <ul className="space-y-3 mb-8">
                    {servicio.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mr-3 mt-0.5 flex-shrink-0 opacity-70" />
                        <span className="font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/agendar">
                    <Button className="w-full rounded-none bg-gray-900 text-white hover:bg-gray-800 transition-colors py-6">
                      Reservar Ahora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="order-2 lg:order-1 relative h-[600px]">
              <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-white/50 z-0"></div>
              <div className="relative z-10 w-full h-[500px] mt-12 mr-12 shadow-2xl">
                <Image
                  src="/images/hero_minimal_living.png"
                  alt="Interior Minimalista"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-light text-gray-900 mb-8">
                Más que orden, <br /> <span className="font-medium text-secondary">Bienestar Integral</span>
              </h2>
              <div className="space-y-10">
                {[
                  { icon: LayoutTemplate, title: "Minimalismo Funcional", desc: "Creamos sistemas que no solo se ven bien, sino que funcionan para tu estilo de vida real." },
                  { icon: Wind, title: "Equilibrio Feng Shui", desc: "Armonizamos la energía de tu hogar para promover la salud, la riqueza y las relaciones positivas." },
                  { icon: Shield, title: "Discreción y Respeto", desc: "Tratamos tus espacios y posesiones con la máxima privacidad y cuidado." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white flex items-center justify-center shadow-sm text-primary">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="equipo" className="py-24 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-secondary font-medium tracking-widest uppercase text-sm">Nuestro Talento</span>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mt-2 mb-8">
              Expertos en Armonía
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Un equipo multidisciplinario unido por la pasión por el orden y el bienestar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              {
                name: "Ana María",
                role: "Organizadora Profesional",
                image: "/images/team_1.png",
                desc: "Especialista en sistemas de organización sostenibles para cocinas y despensas."
              },
              {
                name: "Carlos E.",
                role: "Consultor Feng Shui",
                image: "/images/team_2.png",
                desc: "Arquitecto con certificación en Feng Shui Clásico. Transforma espacios con energía."
              },
              {
                name: "Sofia L.",
                role: "Coach de Orden",
                image: "/images/team_3.png",
                desc: "Experta en método KonMari y detox de clóset. Te ayuda a soltar con gratitud."
              }
            ].map((member, i) => (
              <div key={i} className="group text-center">
                <div className="relative mb-6 inline-block">
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto relative z-10">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl -z-0 scale-75 group-hover:scale-110 transition-transform duration-500"></div>
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-1">{member.name}</h3>
                <p className="text-secondary font-medium text-sm tracking-wide uppercase mb-3">{member.role}</p>
                <p className="text-gray-500 font-light leading-relaxed max-w-xs mx-auto text-sm">
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-24 bg-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-secondary font-medium tracking-widest uppercase text-sm">Experiencias Reales</span>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mt-2 mb-8">
              Historias de Transformación
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                quote: "Mi cocina solía ser un caos que me generaba ansiedad cada mañana. Ahora es mi lugar de paz. El orden lógico que implementaron cambió mi rutina.",
                author: "Camila Rodríguez",
                role: "Diseñadora de Interiores",
                rating: 5
              },
              {
                quote: "Increíble cómo un cambio en la disposición de los muebles y una limpieza energética pudieron desbloquear el ambiente de mi oficina. Siento la diferencia.",
                author: "Andrés Martínez",
                role: "Arquitecto",
                rating: 5
              },
              {
                quote: "El servicio de detox de clóset fue una terapia. Aprendí a soltar lo que ya no vibraba conmigo. El resultado estético es de revista.",
                author: "Valentina Salazar",
                role: "Empresaria",
                rating: 5
              }
            ].map((testimonial, i) => (
              <Card key={i} className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm group hover:-translate-y-2">
                <CardContent className="pt-10 px-8 pb-8 relative">
                  <div className="absolute top-6 left-8">
                    <MessageCircle className="h-8 w-8 text-primary/20 group-hover:text-primary/40 transition-colors" />
                  </div>
                  <div className="flex mb-6 justify-center">
                    {[...Array(testimonial.rating)].map((_, idx) => (
                      <Star key={idx} className="h-5 w-5 fill-amber-400 text-amber-400 mx-0.5" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-8 font-light leading-loose text-lg text-center relative z-10">
                    "{testimonial.quote}"
                  </p>
                  <div className="text-center border-t border-gray-100 pt-6">
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.author}</h4>
                    <span className="text-sm text-primary font-medium">{testimonial.role}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-secondary font-medium tracking-widest uppercase text-sm">Dudas Comunes</span>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mt-2">Preguntas Frecuentes</h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              {
                q: "¿Qué incluye exactamente la organización de cocina?",
                a: "Nuestro servicio es integral: vaciamos completamente el espacio, realizamos una limpieza profunda de superficies, depuramos productos vencidos, categorizamos alimentos y utensilios, e implementamos un sistema de organización lógico y estético. Incluye etiquetas personalizadas básicas."
              },
              {
                q: "¿Cómo funciona la consultoría de Feng Shui online?",
                a: "Es un proceso sencillo y poderoso. Nos envías un plano (puede ser dibujado a mano) y fotos/video de tu espacio. Analizamos el flujo de energía (Chi) y aplicamos el mapa Bagua. Recibirás un 'Manual de Armonía' PDF con curas específicas, paleta de colores sugerida y reubicación de mobiliario."
              },
              {
                q: "¿Debo estar presente durante el servicio de organización?",
                a: "Depende del servicio. Para el 'Detox de Clóset' es vital tu presencia para tomar decisiones sobre qué conservar. Para organización de cocina o despensa, podemos trabajar autónomamente una vez entendamos tus necesidades y rutinas."
              },
              {
                q: "¿Venden los productos organizadores?",
                a: "Llevamos un kit de herramientas esencial. Para contenedores estéticos (canastas, frascos herméticos, divisores de acrílico), podemos trabajar con los que ya tengas, o sugerirte una lista de compra curada de nuestros proveedores aliados con precios especiales."
              }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-none bg-white shadow-sm rounded-lg overflow-hidden data-[state=open]:shadow-md transition-all duration-300 hover:shadow-md">
                <AccordionTrigger className="text-lg font-medium text-gray-700 hover:text-primary hover:no-underline px-6 py-6 [&[data-state=open]]:bg-primary/5 [&[data-state=open]]:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 font-light leading-relaxed px-6 py-6 bg-white text-base">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Agendar Cita */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="bg-primary/5 p-12 md:p-20 text-center max-w-5xl mx-auto relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                Comienza tu viaje hacia <span className="font-bold">la calma</span>
              </h2>
              <p className="text-xl text-gray-600 font-light mb-10 max-w-2xl mx-auto">
                Tu hogar merece ser tu santuario. Agenda hoy y da el primer paso hacia una vida más ligera y organizada.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/agendar">
                  <Button size="lg" className="h-14 px-10 text-lg bg-gray-900 hover:bg-gray-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto">
                    <Calendar className="mr-3 h-5 w-5" />
                    Reservar mi Cita
                  </Button>
                </Link>
                <Link href="https://wa.me/573001234567" target="_blank">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-2 border-gray-200 text-gray-600 hover:text-primary hover:border-primary hover:bg-white w-full sm:w-auto">
                    <MessageCircle className="mr-3 h-5 w-5" />
                    Hablar por WhatsApp
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-light text-gray-900">Minimal <span className="font-bold">Living</span></h3>
              <p className="text-gray-500 text-sm mt-2">Bogotá, Colombia</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-center text-gray-500 font-light text-sm">
              <a href="#" className="hover:text-primary transition-colors">Inicio</a>
              <a href="#servicios" className="hover:text-primary transition-colors">Servicios</a>
              <a href="#testimonios" className="hover:text-primary transition-colors">Testimonios</a>
              <a href="/login" className="hover:text-primary transition-colors">Login</a>
            </div>
            <div className="flex gap-4">
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-primary">
                <Mail className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-primary">
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-50 text-center text-gray-400 text-xs font-light">
            © 2026 Minimal Living. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
