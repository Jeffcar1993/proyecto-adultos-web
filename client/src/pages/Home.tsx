import { Link } from "react-router-dom";
import { BadgeCheck, Sparkles, ShieldCheck, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const cities = [
  { name: "Bogotá", count: "+120 perfiles", image: "https://images.unsplash.com/photo-1624224496507-b8eddbd8867a?auto=format&fit=crop&w=600&q=80" },
  { name: "Medellín", count: "+80 perfiles", image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=600&q=80" },
  { name: "Cali", count: "+45 perfiles", image: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=600&q=80" },
  { name: "Barranquilla", count: "+30 perfiles", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
  { name: "Cartagena", count: "+25 perfiles", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
  { name: "Bucaramanga", count: "+15 perfiles", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
];

export function Home() {
  return (
    <div className="flex flex-col w-full bg-white text-zinc-900">
      
      {/* HERO SECTION - Enfoque en Conversión */}
      <section className="relative overflow-hidden bg-zinc-50 py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-bold text-red-600 border border-red-100 uppercase tracking-widest">
              <Sparkles size={14} /> Contenido Verificado +18
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-zinc-950">
              ENCUENTRA <br />
              <span className="text-red-600 italic">PLACER</span> REAL.
            </h1>
            <p className="text-xl text-zinc-600 max-w-lg leading-relaxed">
              La plataforma más discreta y profesional de Colombia. Perfiles 100% reales con contacto directo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-14 text-lg font-bold shadow-lg shadow-blue-200">
                Explorar Ahora
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-zinc-300">
                Publicar Anuncio
              </Button>
            </div>
          </div>
          
          {/* Elemento Visual Abstracto / Logo de Impacto */}
          <div className="hidden lg:flex justify-center">
             <div className="relative w-80 h-80 bg-red-600 rounded-[40px] rotate-6 flex items-center justify-center shadow-2xl overflow-hidden">
               <img
                src="/erotica.avif"
                alt="Erotica"
                className="h-56 w-auto max-w-[75%] -rotate-6 object-contain"
               />
                <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors cursor-pointer" />
             </div>
          </div>
        </div>
      </section>

      {/* CIUDADES - Diseño de Galería Minimalista */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Ciudades Top</h2>
            <p className="text-zinc-500">Selecciona tu ubicación actual</p>
          </div>
          <Button variant="link" className="text-blue-600 font-bold">Ver todas <ArrowRight size={16} className="ml-2" /></Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cities.map((city) => (
            <Link to={`/ciudad/${city.name.toLowerCase()}`} key={city.name} className="group relative h-[400px] overflow-hidden rounded-3xl bg-zinc-200">
              <img src={city.image} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt={city.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <p className="text-red-500 font-bold text-sm uppercase tracking-widest">{city.count}</p>
                <h3 className="text-4xl font-black text-white">{city.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES - Limpieza y Seguridad */}
      <section className="bg-zinc-950 py-20 text-white">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500">
              <BadgeCheck size={32} />
            </div>
            <h3 className="text-xl font-bold">Verificación Total</h3>
            <p className="text-zinc-400">Garantizamos que las fotos corresponden a la realidad de cada perfil.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 bg-red-600/20 rounded-2xl flex items-center justify-center text-red-500">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold">Privacidad Absoluta</h3>
            <p className="text-zinc-400">Tus datos y búsquedas están protegidos con encriptación de grado militar.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 bg-green-600/20 rounded-2xl flex items-center justify-center text-green-500">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold">Búsqueda Inteligente</h3>
            <p className="text-zinc-400">Filtra por gustos, servicios y cercanía de forma inmediata.</p>
          </div>
        </div>
      </section>

    </div>
  );
}