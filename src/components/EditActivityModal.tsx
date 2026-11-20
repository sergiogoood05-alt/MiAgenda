import React, {useEffect, useRef, useState} from 'react';
import {AlertCircle, Calendar, X} from 'lucide-react';
import {Actividad, getTodayIsoDate} from '../types/agenda';

interface EditActivityModalProps {
  actividad: Actividad;
  onSave: (id: number, nombre: string, fecha: string) => void;
  onCancel: () => void;
}

export function EditActivityModal({
  actividad,
  onSave,
  onCancel,
}: EditActivityModalProps) {
  const [nombre, setNombre] = useState(actividad.nombre);
  const [fecha, setFecha] = useState(actividad.fecha);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = nombre.trim();
    if (!limpio) {
      setError('El nombre de la actividad no puede quedar vacío.');
      inputRef.current?.focus();
      return;
    }
    onSave(actividad.id, limpio, fecha || getTodayIsoDate());
  };

  return (
    <div
      className="fixed inset-0 sm:absolute sm:inset-0 z-50 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="editar-titulo"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div className="bg-white dark:bg-slate-900 w-full rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 shadow-xl">
        <div
          className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4"
          aria-hidden="true"
        />

        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 id="editar-titulo" className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Editar actividad
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cerrar edición"
            className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="editar-nombre"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Nombre de la actividad
            </label>
            <input
              ref={inputRef}
              id="editar-nombre"
              type="text"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                if (e.target.value.trim().length > 0 && error) {
                  setError(null);
                }
              }}
              className={`w-full min-h-[46px] px-3.5 py-2.5 text-base rounded-xl border bg-slate-50/60 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-800 ${
                error
                  ? 'border-red-400 dark:border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40'
              }`}
            />
            {error && (
              <div
                role="alert"
                className="mt-2 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 px-3 py-2 text-sm text-red-700 dark:text-red-300"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="editar-fecha"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Fecha
            </label>
            <div className="relative">
              <Calendar
                className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="editar-fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/70 text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
