import { Link } from "react-router-dom"
import type { ReactNode } from "react"
import { SeoHead } from "@/components/SeoHead"

interface FooterPageLayoutProps {
  title: string
  description: string
  canonical: string
  children: ReactNode
}

export function FooterPageLayout({ title, description, canonical, children }: FooterPageLayoutProps) {
  return (
    <>
      <SeoHead title={title} description={description} canonical={canonical} />
      <section className="mx-auto w-full max-w-4xl px-4 py-14">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900">{title}</h1>
          <div className="space-y-4 text-zinc-700">{children}</div>
          <div className="mt-8">
            <Link to="/" className="text-sm font-semibold text-zinc-900 underline underline-offset-4">
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
