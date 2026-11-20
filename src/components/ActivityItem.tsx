import {Check, Flag, Pencil, Trash2} from 'lucide-react';
import {Actividad, Prioridad, formatDateEs} from '../types/agenda';

interface ActivityItemProps {
  actividad: Actividad;
  onToggleComplete: (id: number) => void;
  onEdit: (actividad: Actividad) => void;
  onDelete: (id: number) => void;
}

const PRIORITY_DISPLAY: Record<Prioridad, {textClass: string; label: string}> = {
  Baja: {textClass: 'text-teal-700 dark:text-teal-400', label: 'Prioridad Baja'},
  Media: {textClass: 'text-amber-700 dark:text-amber-400', label: 'Prioridad Media'},
  Alta: {textClass: 'text-red-600 dark:text-red-400', label: 'Prioridad Alta'},
};

export function ActivityItem({
  actividad,
  onToggleComplete,
  onEdit,
  onDelete,
}: ActivityItemProps) {
  const priorityInfo = PRIORITY_DISPLAY[actividad.prioridad];

  return (
    <li
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 px-2.5 py-2.5 transition-colors ${
        actividad.completada
          ? 'bg-slate-50/80 dark:bg-slate-900/60'
          : 'bg-white dark:bg-slate-900'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          role="checkbox"
          aria-checked={actividad.completada}
          aria-label={
            actividad.completada
              ? `Marcar "${actividad.nombre}" como pendiente`
              : `Marcar "${actividad.nombre}" como completada`
          }
          onClick={() => onToggleComplete(actividad.id)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shrink-0 cursor-pointer"
        >
          <span
            className={`w-[22px] h-[22px] rounded-md border-2 flex items-center justify-center transition-colors ${
              actividad.completada
                ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 text-white'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
            }`}
          >
            {actividad.completada && <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />}
          </span>
        </button>

        <div className="min-w-0 flex-1 py-0.5">
          <p
            className={`text-[15px] font-medium leading-snug break-words ${
              actividad.completada
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {actividad.nombre}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400 tabular-nums">
              {formatDateEs(actividad.fecha)}
            </span>
            <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">
              ·
            </span>
            <span
              className={`inline-flex items-center gap-1 font-semibold ${priorityInfo.textClass}`}
            >
              <Flag className="w-3 h-3 shrink-0" aria-hidden="true" />
              <span>{priorityInfo.label}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onEdit(actividad)}
            aria-label={`Editar "${actividad.nombre}"`}
            title="Editar actividad"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors cursor-pointer"
          >
            <Pencil className="w-[18px] h-[18px]" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(actividad.id)}
            aria-label={`Eliminar "${actividad.nombre}"`}
            title="Eliminar actividad"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-[18px] h-[18px]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}
