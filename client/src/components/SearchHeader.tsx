import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, X } from "lucide-react";
import colombiaData from "@/data/colombia.json";

interface SugerenciaItem {
  tipo: "departamento" | "ciudad" | "barrio";
  nombre: string;
  departamento?: string;
  ciudad?: string;
}

// Interfaz interna para ordenamiento
interface SugerenciaItemConScore extends SugerenciaItem {
  score: number;
}

// Función para normalizar texto (remover acentos y convertir a minúsculas)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remover diacríticos
};

// Función para calcular score de coincidencia
const calculateMatchScore = (text: string, query: string): number => {
  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);

  if (!normalizedText.includes(normalizedQuery)) {
    return 0; // No coincide
  }

  // Puntuación: empieza con valor base
  let score = 1;

  // +100 si empieza con la búsqueda (principal)
  if (normalizedText.startsWith(normalizedQuery)) {
    score += 100;
  }

  // +50 si coincide al inicio de una palabra
  const words = normalizedText.split(/[\s-]/);
  if (words.some((word) => word.startsWith(normalizedQuery))) {
    score += 50;
  }

  // +20 por cada posición anterior donde se encuentra (penaliza búsquedas tardías)
  const indexScore = Math.max(0, 20 - normalizedText.indexOf(normalizedQuery));
  score += indexScore;

  return score;
};

export function SearchHeader() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Estado derivado: calcular sugerencias usando useMemo
  // Esto evita setState sincrónico en useEffect
  const sugerencias = useMemo(() => {
    if (!input.trim()) return [];

    const query = input.trim();
    const results: SugerenciaItemConScore[] = [];

    // Buscar departamentos
    colombiaData.forEach((dep) => {
      const deptScore = calculateMatchScore(dep.departamento, query);
      if (deptScore > 0) {
        results.push({
          tipo: "departamento",
          nombre: dep.departamento,
          departamento: dep.departamento,
          score: deptScore,
        });
      }

      // Buscar ciudades dentro de cada departamento
      dep.ciudades.forEach((ciudad) => {
        const cityScore = calculateMatchScore(ciudad, query);
        if (cityScore > 0) {
          results.push({
            tipo: "ciudad",
            nombre: ciudad,
            departamento: dep.departamento,
            ciudad: ciudad,
            score: cityScore,
          });
        }
      });
    });

    // Ordenar por score descendente
    results.sort((a, b) => b.score - a.score);

    // Limitar a 8 resultados máximo y remover propiedad score
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return results.slice(0, 8).map(({ score, ...item }) => item);
  }, [input]);

  // Mostrar sugerencias si hay input y hay resultados
  const showSuggestions = input.trim().length > 0 && sugerencias.length > 0;

  // Manejar cambio de input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setSelectedIndex(-1); // Resetear selección con el cambio
  };

  const handleSelect = (item: SugerenciaItem) => {
    if (item.tipo === "departamento") {
      navigate(`/perfiles?departamento=${encodeURIComponent(item.nombre)}`);
    } else if (item.tipo === "ciudad") {
      navigate(
        `/perfiles?departamento=${encodeURIComponent(item.departamento || "")}&ciudad=${encodeURIComponent(item.nombre)}`
      );
    }
    // Limpiar input después de navegar
    setTimeout(() => setInput(""), 100);
  };

  // Manejo de teclado (arrow keys + enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || sugerencias.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < sugerencias.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : sugerencias.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(sugerencias[selectedIndex]);
        } else if (input.trim()) {
          // Búsqueda libre por nombre
          navigate(`/perfiles?q=${encodeURIComponent(input)}`);
          setInput("");
        }
        break;
      case "Escape":
        setInput("");
        break;
    }
  };

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setInput("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form
      className="hidden max-w-md flex-1 items-center lg:flex relative"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (input.trim()) {
          navigate(`/perfiles?q=${encodeURIComponent(input)}`);
          setInput("");
        }
      }}
    >
      <div className="relative w-full" ref={suggestionsRef}>
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        <input
          type="search"
          placeholder="Ciudad, departamento, barrio..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="h-12 w-full rounded-full border-zinc-200 bg-zinc-50 pl-11 pr-10 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
        />

        {input && (
          <button
            type="button"
            onClick={() => setInput("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            <X size={16} />
          </button>
        )}

        {/* DROPDOWN DE SUGERENCIAS */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-zinc-200 z-[999] max-h-96 overflow-y-auto">
            {sugerencias.length > 0 ? (
              sugerencias.map((item, idx) => (
                <button
                  key={`${item.tipo}-${item.nombre}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-b border-zinc-100 last:border-b-0 ${
                    idx === selectedIndex
                      ? "bg-emerald-50 hover:bg-emerald-100"
                      : "hover:bg-zinc-50"
                  }`}
                >
                  <MapPin
                    size={16}
                    className={`flex-shrink-0 ${
                      idx === selectedIndex ? "text-emerald-600" : "text-zinc-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium truncate ${
                      idx === selectedIndex ? "text-emerald-900" : "text-zinc-900"
                    }`}>
                      {item.nombre}
                    </div>
                    {item.tipo === "ciudad" && (
                      <div className="text-xs text-zinc-500">{item.departamento}</div>
                    )}
                  </div>
                  <span className="text-xs font-bold uppercase px-2 py-1 rounded whitespace-nowrap flex-shrink-0 bg-zinc-100 text-zinc-600">
                    {item.tipo === "departamento" ? "Depto" : "Ciudad"}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-zinc-500">
                No se encontraron departamentos o ciudades para "{input}"
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
