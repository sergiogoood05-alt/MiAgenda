export type Prioridad = 'Baja' | 'Media' | 'Alta';

export interface Actividad {
  id: number;
  nombre: string;
  fecha: string; // Formato ISO YYYY-MM-DD
  prioridad: Prioridad;
  completada: boolean;
}

export const PRIORIDADES: Prioridad[] = ['Baja', 'Media', 'Alta'];

/**
 * Devuelve la fecha local de hoy en formato YYYY-MM-DD.
 */
export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formatea una fecha YYYY-MM-DD de forma legible en español.
 * Si coincide con la fecha de hoy, indica "Hoy" seguido del día y mes.
 */
export function formatDateEs(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return isoDate;
  }
  const [year, month, day] = parts;
  const dateObj = new Date(year, month - 1, day);
  const formatted = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(dateObj);

  if (isoDate === getTodayIsoDate()) {
    return `Hoy · ${formatted}`;
  }
  return formatted;
}
