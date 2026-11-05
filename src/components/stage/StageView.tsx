import React, { useState, useEffect, useCallback } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { QueueSidebar } from './QueueSidebar';
import { QueueItem, LyricLine } from '../../types/stage';

// Dados de Exemplo Reais e Contextualizados (Clipes Familiares / JW)
const SAMPLE_CURRENT_TRACK: QueueItem = {
  id: 'track-01',
  requestedBy: 'Letícia',
  requestedAt: '2026-11-04T15:00:00Z',
  status: 'playing',
  song: {
    id: 'song-101',
    title: 'Alegria Que Não Tem Fim',
    artist: 'Música & Vídeos Edificantes',
    duration: 222, // 03:42
  },
};

const SAMPLE_QUEUE: QueueItem[] = [
  {
    id: 'track-02',
    requestedBy: 'Marcos',
    requestedAt: '2026-11-04T15:02:00Z',
    status: 'up-next',
    song: {
      id: 'song-102',
      title: 'Coragem Para Vencer',
      artist: 'Música & Vídeos Edificantes',
      duration: 250, // 04:10
    },
  },
  {
    id: 'track-03',
    requestedBy: 'Beatriz',
    requestedAt: '2026-11-04T15:05:00Z',
    status: 'up-next',
    song: {
      id: 'song-103',
      title: 'O Amor Nunca Acaba',
      artist: 'Música & Vídeos Edificantes',
      duration: 198, // 03:18
    },
  },
  {
    id: 'track-04',
    requestedBy: 'Lucas & Sofia',
    requestedAt: '2026-11-04T15:08:00Z',
    status: 'up-next',
    song: {
      id: 'song-104',
      title: 'Segure a Minha Mão',
      artist: 'Canções Infantis & Família',
      duration: 184, // 03:04
    },
  },
];

// Letras Sincronizadas por Segundos (Estilo Cinema / LRC)
const SAMPLE_LYRICS: LyricLine[] = [
  { id: '1', time: 0, text: '♪ Introdução Instrumental ♪' },
  { id: '2', time: 8, text: 'Quando o dia amanhece e a luz começa a brilhar' },
  { id: '3', time: 16, text: 'Sentimos no coração a paz que veio pra ficar' },
  { id: '4', time: 24, text: 'Mesmo se a tempestade tentar nos assustar' },
  { id: '5', time: 32, text: 'Com fé e esperança, nós vamos caminhar' },
  { id: '6', time: 40, text: 'É uma alegria que não tem fim!' },
  { id: '7', time: 48, text: 'Estar com quem a gente ama é bem assim...' },
  { id: '8', time: 56, text: '♪ Solo Instrumental ♪' },
];

export const StageView: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<QueueItem | null>(SAMPLE_CURRENT_TRACK);
  const [queue, setQueue] = useState<QueueItem[]>(SAMPLE_QUEUE);
  const roomCode = 'CANTE-77';

  // Avança a fila quando uma música é finalizada ou pulada
  const handleNextTrack = useCallback(() => {
    if (queue.length > 0) {
      const [nextSong, ...remainingQueue] = queue;
      setCurrentTrack({ ...nextSong, status: 'playing' });
      setQueue(remainingQueue);
    } else {
      setCurrentTrack(null);
    }
  }, [queue]);

  // Suporte a atalhos rápidos de teclado (ideal para TVs e operadores de palco)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight' && e.shiftKey) {
        handleNextTrack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextTrack]);

  return (
    <main className="relative w-screen h-screen bg-[#1A1A2E] text-white overflow-hidden p-6 lg:p-8 xl:p-10 flex flex-col font-sans select-none">
      {/* 
        1. Top Bar Editorial Ultraminimalista:
        Marcação pura de tipografia e espaço, sem bordas ou poluição.
      */}
      <header className="flex items-center justify-between pb-5 lg:pb-6 select-none shrink-0">
        <div className="flex items-center space-x-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9575CD]" />
          <h1 className="text-xs font-semibold tracking-[0.3em] uppercase text-white/80">
            Cante <span className="text-white/30 font-light tracking-[0.2em]">/ PALCO</span>
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-mono text-white/30 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
          <span>SESSÃO ATIVA</span>
        </div>
      </header>

      {/* 
        2. Layout Principal de 2 Colunas (Cinema View):
        - Esquerda (~74%): Player de vídeo cinematográfico com overlay imersivo de legendas.
        - Direita (~26%): Painel de vidro fosco sutil com fila 'Up Next' e QR Code.
        - Separação feita exclusivamente por espaçamento generoso (gap-8/gap-10) sem bordas neon.
      */}
      <div className="flex-1 w-full grid grid-cols-12 gap-6 lg:gap-8 min-h-0">
        {/* Coluna do Player e Legenda Imersiva */}
        <section 
          className="col-span-12 lg:col-span-8 xl:col-span-9 h-full min-h-0 flex flex-col"
          aria-label="Palco de reprodução e legendas"
        >
          <VideoPlayer
            currentTrack={currentTrack}
            lyrics={SAMPLE_LYRICS}
            onTrackEnded={handleNextTrack}
            onSkipTrack={handleNextTrack}
          />
        </section>

        {/* Coluna Lateral da Fila e QR Code */}
        <section 
          className="col-span-12 lg:col-span-4 xl:col-span-3 h-full min-h-0"
          aria-label="Fila de espera e código de acesso"
        >
          <QueueSidebar
            queue={queue}
            roomCode={roomCode}
          />
        </section>
      </div>
    </main>
  );
};

export default StageView;
