const cities = [
  {
    name: "Bogota",
    image:
      "https://images.unsplash.com/photo-1624224496507-b8eddbd8867a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Medellin",
    image:
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Cali",
    image:
      "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Cartagena",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Barranquilla",
    image:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Bucaramanga",
    image:
      "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=1200&q=80",
  },
]

export function Home() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:py-14">
      <section className="grid items-center gap-8 rounded-3xl border border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 p-6 md:grid-cols-[1fr,auto] md:p-10">
        <div className="space-y-4 text-left">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-zinc-900 md:text-6xl">
            Bienvenidos a Erotik Colombia
          </h1>
          <p className="max-w-2xl text-lg text-zinc-700">
            Encuentra en nuestra pagina prepagos en Colombia, masajes eroticos y servicios para adultos.
          </p>
        </div>

        <div className="ml-auto flex h-36 w-36 items-center justify-center rounded-3xl bg-zinc-900 text-3xl font-black text-white shadow-xl md:h-44 md:w-44">
          EC
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-left text-2xl font-extrabold tracking-wide text-zinc-900 md:text-3xl">
          CIUDADES MAS BUSCADAS EN COLOMBIA
        </h2>

        <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <article
              key={city.name}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-black/10" />
                <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{city.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}