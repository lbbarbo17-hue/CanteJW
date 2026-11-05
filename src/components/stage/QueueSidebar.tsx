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
        1. CABEÇALHO E FILA DE REPRODUÇÃO ("A SEGUIR"):
        - Flutuando diretamente sobre o fundo sólido #1A1A2E.
        - Zero cards, zero bordas, zero blocos roxos chapados.
      */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Cabeçalho da Fila */}
        <div className="flex items-center justify-between pb-6 pt-1 shrink-0">
          <h2 className="text-white/40 text-xs font-semibold uppercase tracking-[0.25em]">
            A Seguir
          </h2>
          <span className="text-[11px] font-mono tracking-wider text-white/30">
            {queue.length} {queue.length === 1 ? 'MÚSICA' : 'MÚSICAS'}
          </span>
        </div>

        {/* Lista de Músicas na Fila com Espaçamento Inteligente */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {queue.length === 0 ? (
            <div className="py-12 space-y-2 opacity-40">
              <p className="text-white/60 text-xs font-normal">Fila vazia</p>
              <p className="text-white/30 text-xs font-light">
                Aponte a câmera do celular para pedir uma música.
              </p>
            </div>
          ) : (
            queue.map((item, index) => (
              <div
                key={item.id}
                className="flex items-start justify-between space-x-3.5"
              >
                {/* Posição Numérica */}
                <span className="text-xs font-mono text-white/20 tabular-nums w-5 pt-0.5 shrink-0">
                  {(index + 1).toString().padStart(2, '0')}
                </span>

                {/* Metadados da Faixa e Toque Social Humanizado */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm font-normal tracking-tight truncate">
                    {item.song.title}
                  </h3>
                  
                  <p className="text-white/40 text-xs font-light truncate mt-0.5">
                    {item.song.artist}
                  </p>

                  <p className="text-white/35 text-[11px] font-light mt-1">
                    Pedida por <span className="text-white/70 font-normal">{item.requestedBy}</span>
                  </p>
                </div>

                {/* Duração formatada em monospace discreto */}
                <span className="text-xs text-white/25 font-mono pt-0.5 shrink-0 tabular-nums">
                  {Math.floor(item.song.duration / 60)}:{(item.song.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 
        2. BLOCO DO QR CODE (CENTRALIZADO NA PARTE INFERIOR):
        - QR Code nítido centralizado em base branca.
        - Textos centralizados logo abaixo.
        - Sem caixas delimitadoras ou molduras pesadas.
      */}
      <div className="pt-8 pb-4 shrink-0 flex flex-col items-center text-center space-y-3">
        {/* QR Code Nítido em fundo branco arredondado para captura instantânea */}
        <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-sm shrink-0">
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

        {/* Tipografia de Orientação Centralizada */}
        <div className="space-y-1">
          <p className="text-white text-xs font-medium">
            Peça sua música
          </p>
          <p className="text-white/40 text-[11px] font-light">
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
