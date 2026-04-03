import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BadgeCheck, Sparkles, ShieldCheck, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import bogotaImage from "@/img/bogota.jpeg";
import medellinImage from "@/img/medellin.jpeg";
import caliImage from "@/img/cali.jpeg";
import barranquillaImage from "@/img/barranquilla.jpg";
import cartagenaImage from "@/img/cartagena.jpg";
import bucaramangaImage from "@/img/bucaramanga.jpeg";

const cities = [
  { name: "Bogotá", count: "+120 perfiles", image: bogotaImage },
  { name: "Medellín", count: "+80 perfiles", image: medellinImage },
  { name: "Cali", count: "+45 perfiles", image: caliImage },
  { name: "Barranquilla", count: "+30 perfiles", image: barranquillaImage },
  { name: "Cartagena", count: "+25 perfiles", image: cartagenaImage },
  { name: "Bucaramanga", count: "+15 perfiles", image: bucaramangaImage },
];

export function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const showPublishedMessage =
    (location.state as { anuncioPublicado?: boolean } | null)?.anuncioPublicado === true;

  useEffect(() => {
    if (!showPublishedMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      // Limpiamos el state para que el mensaje no reaparezca al recargar.
      navigate(location.pathname, { replace: true, state: null });
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [showPublishedMessage, navigate, location.pathname]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Erotik Colombia",
    url: "https://erotikcolombia.com",
    description:
      "La plataforma más discreta y segura de anuncios para adultos en Colombia. Perfiles 100% verificados.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://erotikcolombia.com/perfiles?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="flex flex-col w-full bg-white text-zinc-900">
      <Helmet>
        <title>Erotik Colombia | Anuncios para Adultos Verificados</title>
        <meta
          name="description"
          content="La plataforma más discreta y segura de anuncios para adultos en Colombia. Perfiles 100% verificados en Bogotá, Medellín, Cali y más ciudades."
        />
        <link rel="canonical" href="https://erotikcolombia.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Erotik Colombia | Anuncios para Adultos Verificados" />
        <meta
          property="og:description"
          content="La plataforma más discreta y segura de anuncios para adultos en Colombia. Perfiles 100% verificados en Bogotá, Medellín, Cali y más ciudades."
        />
        <meta property="og:url" content="https://erotikcolombia.com/" />
        <meta property="og:image" content="https://erotikcolombia.com/logo.png" />
        <meta property="og:locale" content="es_CO" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {showPublishedMessage && (
        <div className="container mx-auto px-4 pt-6">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider">Anuncio publicado correctamente</p>
            <p className="mt-1 text-sm text-emerald-700">Tu perfil ya fue enviado y se procesó con éxito.</p>
          </div>
        </div>
      )}
      
          {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-zinc-50 py-10 md:py-16 lg:py-24 border-b">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* COLUMNA IZQUIERDA - Contenido */}
          <div className="relative z-10 space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-xs font-bold text-red-600 border border-red-100 uppercase tracking-widest">
              <Sparkles size={12} /> Contenido Verificado +18
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-zinc-950">
              ENCUENTRA <br />
              <span className="text-red-600 italic">PLACER</span> REAL
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-lg leading-relaxed">
              La plataforma más discreta y profesional de Colombia. Perfiles 100% reales con contacto directo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-12 sm:h-14 text-base sm:text-lg font-bold shadow-lg shadow-blue-200 cursor-pointer">
                <Link to="/perfiles">Explorar Ahora</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-12 sm:h-14 text-base sm:text-lg border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer">
                <Link to="/crear-cuenta">Publicar Anuncio</Link>
              </Button>
            </div>
          </div>
          
          {/* COLUMNA DERECHA - Logo */}
          <div className="hidden lg:flex justify-center relative">
            {/* Quitamos el div absolute inset-0 que bloqueaba los clics */}
            <div className="relative group transition-transform duration-500 hover:rotate-3">
              <img
                src="/logo.png"
                alt="Erotica"
                className="h-72 w-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>

        </div>
      </section>

      {/* CIUDADES - Diseño de Galería Minimalista */}
      <section className="py-12 md:py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Ciudades Top</h2>
            <p className="text-sm md:text-base text-zinc-500">Selecciona tu ubicación actual</p>
          </div>
          <Button asChild variant="link" className="text-blue-600 font-bold">
            <Link to="/perfiles">Ver todas <ArrowRight size={16} className="ml-2" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
          {cities.map((city) => (
            <Link
              to={`/perfiles?ciudad=${encodeURIComponent(city.name)}`}
              key={city.name}
              className="group relative h-[160px] sm:h-[240px] md:h-[360px] lg:h-[400px] overflow-hidden rounded-2xl md:rounded-3xl bg-zinc-200"
            >
              <img
                src={city.image}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={city.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
                <p className="text-red-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">{city.count}</p>
                <h3 className="text-xl sm:text-2xl md:text-4xl font-black text-white">{city.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES - Limpieza y Seguridad */}
      <section className="bg-zinc-950 py-14 md:py-20 text-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-0 md:text-center md:space-y-4">
            <div className="h-12 w-12 shrink-0 md:h-16 md:w-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500">
              <BadgeCheck size={24} className="md:hidden" />
              <BadgeCheck size={32} className="hidden md:block" />
            </div>
            <div>
              <h3 className="text-base md:text-xl font-bold">Verificación Total</h3>
              <p className="text-sm text-zinc-400 mt-1">Garantizamos que las fotos corresponden a la realidad de cada perfil.</p>
            </div>
          </div>
          <div className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-0 md:text-center md:space-y-4">
            <div className="h-12 w-12 shrink-0 md:h-16 md:w-16 bg-red-600/20 rounded-2xl flex items-center justify-center text-red-500">
              <ShieldCheck size={24} className="md:hidden" />
              <ShieldCheck size={32} className="hidden md:block" />
            </div>
            <div>
              <h3 className="text-base md:text-xl font-bold">Privacidad Absoluta</h3>
              <p className="text-sm text-zinc-400 mt-1">Tus datos y búsquedas están protegidos y encriptados.</p>
            </div>
          </div>
          <div className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-0 md:text-center md:space-y-4">
            <div className="h-12 w-12 shrink-0 md:h-16 md:w-16 bg-green-600/20 rounded-2xl flex items-center justify-center text-green-500">
              <Search size={24} className="md:hidden" />
              <Search size={32} className="hidden md:block" />
            </div>
            <div>
              <h3 className="text-base md:text-xl font-bold">Búsqueda Inteligente</h3>
              <p className="text-sm text-zinc-400 mt-1">Filtra por gustos, servicios y cercanía de forma inmediata.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}