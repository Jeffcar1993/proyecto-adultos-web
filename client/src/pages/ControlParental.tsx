import { FooterPageLayout } from "@/components/layout/FooterPageLayout"

export function ControlParental() {
  return (
    <FooterPageLayout
      title="Control Parental"
      description="Erotik Colombia es una plataforma solo para adultos. Información sobre herramientas de control parental para proteger a los menores de edad en dispositivos y redes domésticas."
      canonical="/control-parental"
    >
      <p>
        Este sitio contiene contenido exclusivo para adultos mayores de 18 años y no debe ser accesible
        para menores de edad bajo ninguna circunstancia.
      </p>
      <p>
        Recomendamos habilitar herramientas de control parental en dispositivos, navegadores y redes domésticas
        para restringir el acceso a este tipo de contenido.
      </p>
      <p>
        Si detectas uso no autorizado por menores, ajusta los filtros de seguridad y supervisa la actividad
        en línea con herramientas como Google Family Link, Norton Family o los controles integrados de tu sistema operativo.
      </p>
    </FooterPageLayout>
  )
}
