import { FooterPageLayout } from "@/components/layout/FooterPageLayout"

export function ContactoPage() {
  return (
    <FooterPageLayout
      title="Contacto"
      description="¿Necesitas soporte o reportar contenido en Erotik Colombia? Contáctanos en soporte@erotikcolombia.com. Atención de lunes a viernes de 8 a.m. a 6 p.m."
      canonical="/contacto"
    >
      <p>Si necesitas soporte o deseas reportar contenido, puedes escribirnos por nuestros canales oficiales.</p>
      <p>
        <strong>Correo:</strong>{" "}
        <a
          href="mailto:soporte@erotikcolombia.com"
          className="underline underline-offset-4 hover:text-zinc-900"
        >
          soporte@erotikcolombia.com
        </a>
      </p>
      <p><strong>Horario de atención:</strong> lunes a viernes, 8:00 a.m. a 6:00 p.m. (hora Colombia)</p>
    </FooterPageLayout>
  )
}
