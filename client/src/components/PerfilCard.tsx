import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";

interface PerfilCardProps {
  nombre: string;
  fotoPrincipal: string;
  telefono: string;
  whatsapp: string;
}

export function PerfilCard({ nombre, fotoPrincipal, telefono, whatsapp }: PerfilCardProps) {
  
  const handleWhatsApp = () => {
    // Formatear número para link de WhatsApp
    const cleanNumber = whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
  };

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-none bg-zinc-900 text-white">
      <CardContent className="p-0 relative">
        <AspectRatio ratio={3 / 4}>
          <img
            src={fotoPrincipal}
            alt={nombre}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </AspectRatio>
        {/* Degradado para que el nombre se vea bien */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
        <h3 className="absolute bottom-3 left-4 text-xl font-bold uppercase tracking-wider">
          {nombre}
        </h3>
      </CardContent>
      
      <CardFooter className="p-3 grid grid-cols-2 gap-2 bg-zinc-800">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 border-zinc-600 hover:bg-zinc-700 text-black"
          onClick={() => window.open(`tel:${telefono}`)}
        >
          <Phone size={16} />
          Llamar
        </Button>
        <Button 
          size="sm" 
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          onClick={handleWhatsApp}
        >
          <MessageCircle size={16} />
          WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
}