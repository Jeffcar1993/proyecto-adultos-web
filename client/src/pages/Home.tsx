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
      <section className="relative overflow-hidden bg-zinc-50 py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* COLUMNA IZQUIERDA - Contenido */}
          <div className="relative z-10 space-y-8"> {/* Añadido z-10 para asegurar que esté arriba */}
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-bold text-red-600 border border-red-100 uppercase tracking-widest">
              <Sparkles size={14} /> Contenido Verificado +18
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-zinc-950">
              ENCUENTRA <br />
              <span className="text-red-600 italic">PLACER</span> REAL
            </h1>
            <p className="text-xl text-zinc-600 max-w-lg leading-relaxed">
              La plataforma más discreta y profesional de Colombia. Perfiles 100% reales con contacto directo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* IMPORTANTE: Usa asChild para que el cursor funcione correctamente con el Link */}
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-14 text-lg font-bold shadow-lg shadow-blue-200 cursor-pointer">
                <Link to="/perfiles">Explorar Ahora</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer">
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
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Ciudades Top</h2>
            <p className="text-zinc-500">Selecciona tu ubicación actual</p>
          </div>
          <Button asChild variant="link" className="text-blue-600 font-bold">
            <Link to="/perfiles">Ver todas <ArrowRight size={16} className="ml-2" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cities.map((city) => (
            <Link
              to={`/perfiles?ciudad=${encodeURIComponent(city.name)}`}
              key={city.name}
              className="group relative h-[400px] overflow-hidden rounded-3xl bg-zinc-200"
            >
              <img
                src={city.image}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={city.name}
              />
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
            <p className="text-zinc-400">Tus datos y búsquedas están protegidos y encriptados.</p>
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