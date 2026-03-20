import { FooterPageLayout } from "@/components/layout/FooterPageLayout"

export function CondicionesUso() {
  return (
    <FooterPageLayout
      title="Condiciones de Uso"
      description="Términos y condiciones de uso de Erotik Colombia. Plataforma exclusiva para mayores de edad. Lee nuestras normas de uso responsable del contenido."
      canonical="/condiciones-uso"
    >
      <p>El acceso a esta plataforma está destinado exclusivamente a personas mayores de 18 años.</p>
      <p>
        Al navegar en el sitio, aceptas nuestras políticas, el uso responsable del contenido y el cumplimiento
        de la normativa local aplicable en Colombia.
      </p>
      <p>
        Nos reservamos el derecho de modificar, suspender o limitar servicios ante incumplimientos o actividades
        indebidas por parte de cualquier usuario.
      </p>
    </FooterPageLayout>
  )
}
