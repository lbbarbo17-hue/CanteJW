import React from 'react';
import { QueueItem } from '../../types/stage';

interface QueueSidebarProps {
  queue: QueueItem[];
  roomCode: string;
}

export const QueueSidebar: React.FC<QueueSidebarProps> = ({ queue, roomCode }) => {
  return (
    <aside className="w-full h-full flex flex-col justify-between select-none">
      {/* 
        1. Cabeçalho Minimalista da Fila:
        Apenas texto refinado flutuando diretamente sobre o fundo sólido #1A1A2E.
      */}
      <div className="flex items-center justify-between pb-6 pt-2 shrink-0">
        <h2 className="text-white/40 text-xs font-semibold uppercase tracking-[0.25em]">
          A Seguir
        </h2>
        <span className="text-[11px] font-mono tracking-wider text-white/30">
          {queue.length} {queue.length === 1 ? 'MÚSICA' : 'MÚSICAS'}
        </span>
      </div>

      {/* 
        2. Lista da Fila ("A Seguir") - Impecavelmente Alinhada:
        Espaçamento generoso, sem caixas ou bordas.
      */}
      <div className="flex-1 overflow-y-auto space-y-7 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {queue.length === 0 ? (
          <div className="py-12 space-y-2 opacity-40">
            <p className="text-white/60 text-xs font-normal">Fila vazia</p>
            <p className="text-white/30 text-xs font-light">
              Aponte a câmera para pedir a próxima música.
            </p>
          </div>
        ) : (
          queue.map((item, index) => (
            <div
              key={item.id}
              className="flex items-start justify-between space-x-4"
            >
              {/* Posição Numérica Alinhada */}
              <span className="text-xs font-mono text-white/20 tabular-nums w-5 pt-0.5 shrink-0">
                {(index + 1).toString().padStart(2, '0')}
              </span>

              {/* Informações da Música e Toque Social Humanizado */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-base font-normal tracking-tight truncate">
                  {item.song.title}
                </h3>
                
                <p className="text-white/40 text-xs font-light truncate mt-0.5">
                  {item.song.artist}
                </p>

                <p className="text-white/40 text-xs font-light mt-1">
                  Pedida por <span className="text-white/75 font-normal">{item.requestedBy}</span>
                </p>
              </div>

              {/* Duração formatada */}
              <span className="text-xs text-white/25 font-mono pt-0.5 shrink-0 tabular-nums">
                {Math.floor(item.song.duration / 60)}:{(item.song.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          ))
        )}
      </div>

      {/* 
        3. Bloco do QR Code e Entrada na Sala:
        Totalmente integrado à coluna, sem caixas delimitadoras pesadas.
      */}
      <div className="pt-8 shrink-0 flex flex-col items-start space-y-3">
        {/* QR Code Nítido em fundo branco arredondado para captura instantânea */}
        <div className="w-24 h-24 bg-white p-2 rounded-xl shrink-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            fill="black"
            aria-label={`QR Code para entrar na sala ${roomCode}`}
          >
            {/* Marcador Superior Esquerdo */}
            <rect x="10" y="10" width="28" height="28" fill="black" />
            <rect x="14" y="14" width="20" height="20" fill="white" />
            <rect x="18" y="18" width="12" height="12" fill="black" />

            {/* Marcador Superior Direito */}
            <rect x="62" y="10" width="28" height="28" fill="black" />
            <rect x="66" y="14" width="20" height="20" fill="white" />
            <rect x="70" y="18" width="12" height="12" fill="black" />

            {/* Marcador Inferior Esquerdo */}
            <rect x="10" y="62" width="28" height="28" fill="black" />
            <rect x="14" y="66" width="20" height="20" fill="white" />
            <rect x="18" y="70" width="12" height="12" fill="black" />

            {/* Padrões de Dados do QR Code */}
            <rect x="44" y="10" width="6" height="6" />
            <rect x="52" y="16" width="6" height="6" />
            <rect x="44" y="24" width="6" height="6" />
            <rect x="10" y="44" width="6" height="6" />
            <rect x="22" y="48" width="6" height="6" />
            <rect x="34" y="44" width="6" height="6" />
            <rect x="44" y="44" width="12" height="12" />
            <rect x="62" y="44" width="6" height="6" />
            <rect x="76" y="48" width="6" height="6" />
            <rect x="84" y="44" width="6" height="6" />
            <rect x="44" y="62" width="6" height="6" />
            <rect x="52" y="70" width="6" height="6" />
            <rect x="44" y="80" width="6" height="6" />
            <rect x="64" y="64" width="8" height="8" />
            <rect x="78" y="64" width="6" height="6" />
            <rect x="70" y="78" width="8" height="8" />
            <rect x="82" y="82" width="6" height="6" />
          </svg>
        </div>

        {/* Tipografia de Orientação e Código */}
        <div className="space-y-1">
          <p className="text-white text-sm font-medium">
            Peça sua música
          </p>
          <p className="text-white/40 text-xs font-light">
            Aponte a câmera do celular para entrar.
          </p>
          <p className="text-xs font-mono tracking-widest text-[#9575CD] font-medium pt-0.5">
            CÓDIGO: {roomCode}
          </p>
        </div>
      </div>
    </aside>
  );
};
