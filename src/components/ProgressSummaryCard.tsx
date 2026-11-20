interface ProgressSummaryCardProps {
  total: number;
  completadas: number;
}

export function ProgressSummaryCard({total, completadas}: ProgressSummaryCardProps) {
  const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;
  const todoCompletado = total > 0 && completadas === total;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (porcentaje / 100) * circumference;

  return (
    <section
      aria-label="Resumen de progreso"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Resumen de progreso
            </h2>
            {todoCompletado && (
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                ¡Todo listo!
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
            {total === 0
              ? 'Aún no hay actividades agregadas'
              : `${completadas} de ${total} ${
                  total === 1 ? 'actividad completada' : 'actividades completadas'
                }`}
          </p>

          <div
            className="mt-3 h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={porcentaje}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progreso total: ${porcentaje}%`}
          >
            <div
              className={`h-full rounded-full transition-all duration-200 ease-out ${
                todoCompletado
                  ? 'bg-emerald-600 dark:bg-emerald-500'
                  : 'bg-blue-600 dark:bg-blue-500'
              }`}
              style={{width: `${porcentaje}%`}}
            />
          </div>
        </div>

        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
            <circle
              cx="28"
              cy="28"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              className="text-slate-200 dark:text-slate-800"
            />
            <circle
              cx="28"
              cy="28"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-200 ease-out ${
                todoCompletado
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-blue-600 dark:text-blue-500'
              }`}
            />
          </svg>
          <span
            className={`absolute text-xs font-bold tabular-nums ${
              todoCompletado
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {porcentaje}%
          </span>
        </div>
      </div>
    </section>
  );
}
