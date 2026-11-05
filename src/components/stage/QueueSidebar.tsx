import React from 'react';
import { QueueItem } from '../../types/stage';

interface QueueSidebarProps {
  queue: QueueItem[];
  roomCode: string;
}

export const QueueSidebar: React.FC<QueueSidebarProps> = ({ queue, roomCode }) => {
  return (
    <aside className="w-full h-full flex flex-col justify-between bg-white/[0.015] backdrop-blur-2xl rounded-3xl p-6 lg:p-8 select-none border border-white/[0.03]">
      {/* 
        1. Cabeçalho Minimalista da Fila:
        Separação puramente por espaçamento e tipografia sutil.
      */}
      <div className="flex items-center justify-between pb-6 border-b border-white/[0.03]">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9575CD]" />
          <h2 className="text-white/50 text-xs font-medium uppercase tracking-[0.25em]">
            A Seguir
          </h2>
        </div>
        <span className="text-[11px] font-mono tracking-wider text-white/25">
          {queue.length} {queue.length === 1 ? 'MÚSICA' : 'MÚSICAS'}
        </span>
      </div>

      {/* 
        2. Lista da Fila ("Up Next") - Zero Card Hell:
        Sem blocos roxos, sem caixinhas fatiadas. Tipografia editorial fluida e arejada.
      */}
      <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {queue.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-2 opacity-40">
            <p className="text-white/60 text-xs font-normal">Nenhuma música na fila</p>
            <p className="text-white/30 text-[11px] font-light">
              Escaneie o código abaixo para adicionar a sua.
            </p>
          </div>
        ) : (
          queue.map((item, index) => (
            <div
              key={item.id}
              className="group flex items-start space-x-3.5 transition-colors"
            >
              {/* Posição Numérica */}
              <span className="text-white/20 font-mono text-xs font-normal pt-0.5 w-4 tabular-nums">
                {(index + 1).toString().padStart(2, '0')}
              </span>

              {/* Informações da Música e Toque Social Humanizado */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white/90 text-sm font-normal tracking-tight truncate group-hover:text-white transition-colors">
                  {item.song.title}
                </h3>
                
                <p className="text-white/40 text-xs font-light truncate mt-0.5">
                  {item.song.artist}
                </p>

                {/* Toque Social Humanizado: "Pedida por [Nome]" */}
                <div className="mt-1 flex items-center space-x-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#9575CD]/40" />
                  <span className="text-[11px] font-light text-white/35">
                    Pedida por <span className="text-white/70 font-normal">{item.requestedBy}</span>
                  </span>
                </div>
              </div>

              {/* Duração em Monospace Sutil */}
              <span className="text-[11px] text-white/25 font-mono pt-0.5 tabular-nums">
                {Math.floor(item.song.duration / 60)}:{(item.song.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          ))
        )}
      </div>

      {/* 
        3. Bloco do QR Code e Entrada na Sala:
        Design sóbrio, integrado com o painel fosco. Alto contraste no QR Code para leitura rápida de longe.
      */}
      <div className="pt-6 border-t border-white/[0.03]">
        <div className="flex items-center space-x-5">
          {/* QR Code Nítido em fundo branco arredondado para captura instantânea */}
          <div className="p-2.5 bg-white rounded-2xl shadow-xl shrink-0">
            <svg
              className="w-20 h-20"
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

              {/* Padrão de Dados do QR Code */}
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

          {/* Instruções Humanizadas e Código da Sala */}
          <div className="space-y-1.5 min-w-0">
            <h4 className="text-white/90 text-xs font-medium tracking-tight">
              Peça sua música
            </h4>
            <p className="text-white/40 text-[11px] font-light leading-relaxed">
              Aponte a câmera do celular para entrar na sessão.
            </p>
            <div className="pt-1 flex items-baseline space-x-1.5">
              <span className="text-white/30 text-[10px] font-mono tracking-widest uppercase">
                Código:
              </span>
              <span className="text-[#9575CD] font-mono font-medium text-xs tracking-widest">
                {roomCode}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
