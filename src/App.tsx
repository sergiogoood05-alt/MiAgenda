/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useEffect, useMemo, useRef, useState} from 'react';
import {
  BatteryFull,
  Code2,
  Moon,
  Search,
  Signal,
  Sun,
  Wifi,
  X,
} from 'lucide-react';
import {ActivityForm} from './components/ActivityForm';
import {ActivityItem} from './components/ActivityItem';
import {EditActivityModal} from './components/EditActivityModal';
import {KotlinCodeViewer} from './components/KotlinCodeViewer';
import {ProgressSummaryCard} from './components/ProgressSummaryCard';
import {Actividad, Prioridad} from './types/agenda';

function getCurrentClock(): string {
  const now = new Date();
  return now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function App() {
  // Estado en memoria: se conserva únicamente mientras la aplicación está abierta
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const nextIdRef = useRef(1);

  const [busqueda, setBusqueda] = useState('');
  const [actividadEditando, setActividadEditando] = useState<Actividad | null>(null);
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [horaActual, setHoraActual] = useState(getCurrentClock);

  useEffect(() => {
    const timer = setInterval(() => {
      setHoraActual(getCurrentClock());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', modoOscuro);
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', modoOscuro ? '#0F172A' : '#2563EB');
    }
  }, [modoOscuro]);

  const handleAddActividad = (nombre: string, fecha: string, prioridad: Prioridad) => {
    const nueva: Actividad = {
      id: nextIdRef.current++,
      nombre,
      fecha,
      prioridad,
      completada: false,
    };
    setActividades((prev) => [nueva, ...prev]);
  };

  const handleToggleComplete = (id: number) => {
    setActividades((prev) =>
      prev.map((item) =>
        item.id === id ? {...item, completada: !item.completada} : item
      )
    );
  };

  const handleDeleteActividad = (id: number) => {
    setActividades((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveEdit = (id: number, nombre: string, fecha: string) => {
    setActividades((prev) =>
      prev.map((item) => (item.id === id ? {...item, nombre, fecha} : item))
    );
    setActividadEditando(null);
  };

  const totalTareas = actividades.length;
  const tareasCompletadas = useMemo(
    () => actividades.filter((a) => a.completada).length,
    [actividades]
  );

  const actividadesFiltradas = useMemo(() => {
    const consulta = busqueda.trim().toLowerCase();
    if (!consulta) return actividades;
    return actividades.filter((item) =>
      item.nombre.toLowerCase().includes(consulta)
    );
  }, [actividades, busqueda]);

  return (
    <div className="min-h-screen bg-[#F6F8FA] dark:bg-slate-950 sm:bg-slate-200/80 dark:sm:bg-slate-950 sm:flex sm:items-center sm:justify-center sm:p-5 transition-colors">
      {/* Marco de dispositivo móvil Android en pantallas medianas/grandes */}
      <div className="relative w-full min-h-screen sm:min-h-0 sm:w-[392px] sm:h-[812px] sm:max-h-[calc(100vh-2.5rem)] sm:rounded-[46px] sm:bg-slate-900 dark:sm:bg-slate-800 sm:p-[11px] sm:shadow-[0_24px_60px_-15px_rgba(15,23,42,0.45)] sm:ring-1 sm:ring-slate-950/20 dark:sm:ring-slate-700/60 flex flex-col">
        {/* Botones físicos laterales del teléfono */}
        <div
          className="hidden sm:block absolute -left-[3px] top-28 w-[3px] h-11 bg-slate-800 dark:bg-slate-700 rounded-l-sm"
          aria-hidden="true"
        />
        <div
          className="hidden sm:block absolute -left-[3px] top-42 w-[3px] h-11 bg-slate-800 dark:bg-slate-700 rounded-l-sm"
          aria-hidden="true"
        />
        <div
          className="hidden sm:block absolute -right-[3px] top-34 w-[3px] h-16 bg-slate-800 dark:bg-slate-700 rounded-r-sm"
          aria-hidden="true"
        />

        {/* Pantalla del celular */}
        <div className="relative flex-1 min-h-0 w-full bg-[#F6F8FA] dark:bg-slate-950 sm:rounded-[35px] overflow-hidden flex flex-col transition-colors">
          {/* Barra de estado Android (visible dentro del marco móvil) */}
          <div
            className="hidden sm:flex items-center justify-between px-6 pt-2.5 pb-1 bg-white dark:bg-slate-900 text-[11px] font-semibold text-slate-900 dark:text-slate-100 select-none shrink-0 transition-colors"
            aria-hidden="true"
          >
            <span className="tabular-nums w-12">{horaActual}</span>
            <span className="w-3 h-3 rounded-full bg-slate-900 dark:bg-black ring-2 ring-slate-800/30 dark:ring-slate-700/50" />
            <div className="flex items-center justify-end gap-1.5 w-12 text-slate-800 dark:text-slate-200">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <BatteryFull className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Barra superior de la app */}
          <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between gap-2 shrink-0 transition-colors">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0">
              Mi Agenda
            </h1>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setModoOscuro((prev) => !prev)}
                aria-label={
                  modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
                }
                aria-pressed={modoOscuro}
                title={modoOscuro ? 'Modo claro' : 'Modo oscuro'}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors cursor-pointer"
              >
                {modoOscuro ? (
                  <Sun className="w-[18px] h-[18px] text-amber-400" aria-hidden="true" />
                ) : (
                  <Moon className="w-[18px] h-[18px]" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setMostrarCodigo(true)}
                className="min-h-[44px] px-2.5 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Code2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Código Kotlin</span>
              </button>
            </div>
          </header>

          {/* Contenido desplazable de la pantalla única */}
          <main className="flex-1 min-h-0 overflow-y-auto px-3.5 py-3.5 space-y-3.5">
            <ActivityForm onAdd={handleAddActividad} />

            <ProgressSummaryCard
              total={totalTareas}
              completadas={tareasCompletadas}
            />

            <section aria-label="Lista de actividades" className="space-y-3 pb-2">
              <div className="relative">
                <Search
                  className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar actividad por nombre..."
                  aria-label="Buscar actividad por nombre"
                  className="w-full min-h-[46px] pl-10 pr-11 py-2.5 text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-colors"
                />
                {busqueda.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setBusqueda('')}
                    aria-label="Limpiar búsqueda"
                    className="min-h-[44px] min-w-[44px] absolute right-0.5 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              {actividades.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-5 py-9 text-center transition-colors">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Aún no tienes actividades
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
                    Escribe una actividad arriba y pulsa «Agregar actividad» para comenzar.
                  </p>
                </div>
              ) : actividadesFiltradas.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-5 py-8 text-center transition-colors">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Sin resultados
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    No se encontraron actividades que coincidan con «{busqueda.trim()}».
                  </p>
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {actividadesFiltradas.map((actividad) => (
                    <ActivityItem
                      key={actividad.id}
                      actividad={actividad}
                      onToggleComplete={handleToggleComplete}
                      onEdit={setActividadEditando}
                      onDelete={handleDeleteActividad}
                    />
                  ))}
                </ul>
              )}
            </section>
          </main>

          {/* Barra de navegación gestual Android */}
          <div
            className="hidden sm:flex items-center justify-center py-2 bg-[#F6F8FA] dark:bg-slate-950 shrink-0 transition-colors"
            aria-hidden="true"
          >
            <span className="w-28 h-1 rounded-full bg-slate-400/70 dark:bg-slate-600/80" />
          </div>

          {actividadEditando && (
            <EditActivityModal
              actividad={actividadEditando}
              onSave={handleSaveEdit}
              onCancel={() => setActividadEditando(null)}
            />
          )}

          {mostrarCodigo && (
            <div
              className="fixed inset-0 sm:absolute sm:inset-0 z-50 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs flex items-end justify-center"
              role="dialog"
              aria-modal="true"
              aria-label="Código Kotlin Jetpack Compose"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setMostrarCodigo(false);
                }
              }}
            >
              <div className="w-full h-[86%] bg-slate-900 rounded-t-3xl flex flex-col overflow-hidden border-t border-slate-800">
                <div
                  className="w-10 h-1 bg-slate-700 rounded-full mx-auto mt-2.5 mb-1 shrink-0"
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 shrink-0">
                  <span className="text-sm font-semibold text-white">
                    Código Android (Kotlin + Compose)
                  </span>
                  <button
                    type="button"
                    onClick={() => setMostrarCodigo(false)}
                    aria-label="Cerrar código Kotlin"
                    className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-xl text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-hidden p-3">
                  <KotlinCodeViewer />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
