import React, {useRef, useState} from 'react';
import {AlertCircle, Calendar, Flag, Plus} from 'lucide-react';
import {PRIORIDADES, Prioridad, getTodayIsoDate} from '../types/agenda';

interface ActivityFormProps {
  onAdd: (nombre: string, fecha: string, prioridad: Prioridad) => void;
}

const PRIORITY_BUTTON_STYLES: Record<Prioridad, {active: string; icon: string}> = {
  Baja: {
    active:
      'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs ring-1 ring-teal-200 dark:ring-teal-800',
    icon: 'text-teal-600 dark:text-teal-400',
  },
  Media: {
    active:
      'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 shadow-xs ring-1 ring-amber-200 dark:ring-amber-800',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  Alta: {
    active:
      'bg-white dark:bg-slate-900 text-red-700 dark:text-red-300 shadow-xs ring-1 ring-red-200 dark:ring-red-800',
    icon: 'text-red-600 dark:text-red-400',
  },
};

export function ActivityForm({onAdd}: ActivityFormProps) {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [prioridad, setPrioridad] = useState<Prioridad>('Media');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = nombre.trim();
    if (!limpio) {
      setError('Por favor, escribe una actividad antes de agregar.');
      inputRef.current?.focus();
      return;
    }

    const fechaFinal = fecha || getTodayIsoDate();
    onAdd(limpio, fechaFinal, prioridad);
    setNombre('');
    setFecha('');
    setPrioridad('Media');
    setError(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3.5 transition-colors"
    >
      <div>
        <label
          htmlFor="actividad-nombre"
          className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1.5"
        >
          Nueva actividad
        </label>
        <input
          ref={inputRef}
          id="actividad-nombre"
          type="text"
          value={nombre}
          onChange={(e) => {
            const val = e.target.value;
            setNombre(val);
            if (val.trim().length > 0 && error) {
              setError(null);
            }
          }}
          placeholder="Ej. Estudiar Jetpack Compose"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'actividad-error' : undefined}
          className={`w-full min-h-[46px] px-3.5 py-2.5 text-base rounded-xl border bg-slate-50/60 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:bg-white dark:focus:bg-slate-800 ${
            error
              ? 'border-red-400 dark:border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40'
              : 'border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40'
          }`}
        />

        {error && (
          <div
            id="actividad-error"
            role="alert"
            className="mt-2 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 px-3 py-2 text-sm text-red-700 dark:text-red-300"
          >
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <label
            htmlFor="actividad-fecha"
            className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5"
          >
            Fecha <span className="text-slate-400 dark:text-slate-500">(hoy si no eliges)</span>
          </label>
          <div className="relative">
            <Calendar
              className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="actividad-fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full min-h-[44px] pl-10 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/70 text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-colors"
            />
          </div>
        </div>

        <div>
          <span className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
            Prioridad
          </span>
          <div
            role="group"
            aria-label="Seleccionar prioridad"
            className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl"
          >
            {PRIORIDADES.map((nivel) => {
              const selected = prioridad === nivel;
              const style = PRIORITY_BUTTON_STYLES[nivel];
              return (
                <button
                  key={nivel}
                  type="button"
                  onClick={() => setPrioridad(nivel)}
                  aria-pressed={selected}
                  className={`min-h-[38px] px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer ${
                    selected
                      ? style.active
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Flag
                    className={`w-3.5 h-3.5 shrink-0 ${
                      selected ? style.icon : 'text-slate-400 dark:text-slate-500'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{nivel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 cursor-pointer"
      >
        <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="whitespace-nowrap">Agregar actividad</span>
      </button>
    </form>
  );
}
