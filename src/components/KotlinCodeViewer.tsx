import {useState} from 'react';
import {Check, Copy} from 'lucide-react';
import {MAIN_ACTIVITY_KT} from '../data/kotlinSource';

export function KotlinCodeViewer() {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MAIN_ACTIVITY_KT);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden text-slate-100">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-800 bg-slate-950/60">
        <div className="min-w-0">
          <p className="text-xs font-mono text-slate-300 truncate">
            MainActivity.kt
          </p>
          <p className="text-[11px] text-slate-400">
            Kotlin + Jetpack Compose (Material 3)
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-100 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {copiado ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
              <span>Copiar código</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-3.5">
        <pre className="font-mono text-[11px] leading-relaxed text-slate-200 whitespace-pre">
          <code>{MAIN_ACTIVITY_KT}</code>
        </pre>
      </div>
    </div>
  );
}
