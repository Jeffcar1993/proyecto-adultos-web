import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface PerfilCardProps {
  id: string | number;
  nombre: string;
  fotoPrincipal: string;
  telefono: string;
  whatsapp: string;
  ciudad?: string;
  departamento?: string;
  barrio?: string;
}

export function PerfilCard({
  id,
  nombre,
  fotoPrincipal,
  telefono,
  whatsapp,
  ciudad,
  departamento,
  barrio,
}: PerfilCardProps) {
  
  const handleWhatsApp = () => {
    // Formatear número para link de WhatsApp
    const cleanNumber = whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
  };

  const handleCall = () => {
    if (!telefono) return;
    window.open(`tel:${telefono}`);
  };

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border border-zinc-200 bg-white text-zinc-900">
      <Link to={`/perfil/${id}`} aria-label={`Ver perfil de ${nombre}`}>
        <CardContent className="p-0 relative">
          <AspectRatio ratio={3 / 4}>
            <img
              src={fotoPrincipal}
              alt={nombre}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          </AspectRatio>
          {/* Degradado para que el nombre se vea bien */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-xl font-bold uppercase tracking-wider line-clamp-1">{nombre}</h3>
            {(ciudad || departamento) && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-zinc-200">
                <MapPin size={12} />
                {ciudad}
                {barrio ? `, ${barrio}` : ""}
                {departamento ? ` - ${departamento}` : ""}
              </p>
            )}
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="grid grid-cols-2 gap-2 border-t border-zinc-100 bg-white py-2 px-3">
        <Button
          size="sm"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleCall}
          aria-label="Llamar"
        >
          <Phone size={15} />
          <span className="hidden sm:inline text-xs font-semibold">Llamar</span>
        </Button>
        <Button
          size="sm"
          className="flex items-center justify-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
          onClick={handleWhatsApp}
          aria-label="WhatsApp"
        >
          <MessageCircle size={15} />
          <span className="hidden sm:inline text-xs font-semibold">WhatsApp</span>
        </Button>
      </CardFooter>
    </Card>
  );
}