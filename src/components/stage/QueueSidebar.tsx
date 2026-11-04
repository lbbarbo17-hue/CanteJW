import React from 'react';
import { QueueItem } from '../../types/stage';

interface QueueSidebarProps {
  queue: QueueItem[];
  roomCode: string;
}

export const QueueSidebar: React.FC<QueueSidebarProps> = ({ queue, roomCode }) => {
  return (
    <aside className="w-full h-full flex flex-col justify-between bg-[#4A148C]/15 backdrop-blur-md rounded-2xl border border-white/[0.06] p-5 shadow-2xl overflow-hidden select-none">
      {/* 1. Cabeçalho Minimalista da Fila */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9575CD]" />
          <h2 className="text-white text-xs font-semibold uppercase tracking-widest">
            A Seguir
          </h2>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#9575CD]/15 text-[#9575CD] border border-[#9575CD]/20">
          {queue.length} {queue.length === 1 ? 'música' : 'músicas'}
        </span>
      </div>

      {/* 2. Lista de Músicas na Fila ("Up Next") */}
      <div className="flex-1 overflow-y-auto py-3 space-y-2.5 my-2 pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {queue.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 opacity-50">
            <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-white/60 text-xs font-medium">Fila vazia</p>
            <p className="text-white/40 text-[11px] leading-relaxed">
              Use o QR Code abaixo para escolher o próximo clipe.
            </p>
          </div>
        ) : (
          queue.map((item, index) => (
            <div
              key={item.id}
              className="group p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all duration-200 flex items-start space-x-3"
            >
              {/* Indicador Numérico de Posição */}
              <span className="text-white/30 font-mono text-xs font-medium pt-0.5 w-4 text-center tabular-nums">
                {(index + 1).toString().padStart(2, '0')}
              </span>

              {/* Informações da Faixa */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-medium leading-snug truncate group-hover:text-white transition-colors">
                  {item.song.title}
                </h3>
                
                <p className="text-white/40 text-xs truncate mt-0.5 font-light">
                  {item.song.artist}
                </p>

                {/* Toque Social: Autor do Pedido */}
                <div className="mt-1.5 flex items-center space-x-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#9575CD]/60" />
                  <span className="text-xs text-white/60">
                    Pedida por <span className="text-[#9575CD] font-medium">{item.requestedBy}</span>
                  </span>
                </div>
              </div>

              {/* Duração formatada da música */}
              <span className="text-[11px] text-white/30 font-mono pt-0.5">
                {Math.floor(item.song.duration / 60)}:{(item.song.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          ))
        )}
      </div>

      {/* 3. Bloco do QR Code e Entrada na Sala (Sem firulas ou excessos) */}
      <div className="pt-3 border-t border-white/[0.06]">
        <div className="bg-[#131222]/80 border border-white/[0.08] p-4 rounded-xl flex flex-col items-center text-center space-y-3">
          
          {/* QR Code Container de Alto Contraste (Otimizado para leitura rápida de câmera de celular à distância) */}
          <div className="p-2 bg-white rounded-lg shadow-md border border-white/20">
            {/* SVG Vetorial de QR Code nítido representando 'cante.app/sala/[roomCode]' */}
            <svg
              className="w-24 h-24"
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

              {/* Padrões de Dados Central e Bordas */}
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

          {/* Instrução Humanizada e Código da Sala */}
          <div className="space-y-1">
            <p className="text-white text-xs font-normal tracking-wide">
              Aponte a câmera do celular para entrar na sala
            </p>
            <div className="inline-flex items-center space-x-1.5 pt-0.5">
              <span className="text-white/40 text-[11px] uppercase tracking-wider">Código:</span>
              <span className="text-[#9575CD] font-mono font-semibold text-xs tracking-widest">
                {roomCode}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
