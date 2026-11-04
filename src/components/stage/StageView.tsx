import React, { useState } from 'react';
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
  { id: '2', time: 10, text: 'Quando o dia amanhece e a luz começa a brilhar' },
  { id: '3', time: 18, text: 'Sentimos no coração a paz que veio pra ficar' },
  { id: '4', time: 26, text: 'Mesmo se a tempestade tentar nos assustar' },
  { id: '5', time: 34, text: 'Com fé e esperança, nós vamos caminhar' },
  { id: '6', time: 42, text: 'É uma alegria que não tem fim!' },
  { id: '7', time: 50, text: 'Estar com quem a gente ama é bem assim...' },
  { id: '8', time: 60, text: '♪ Solo Instrumental ♪' },
];

export const StageView: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<QueueItem | null>(SAMPLE_CURRENT_TRACK);
  const [queue, setQueue] = useState<QueueItem[]>(SAMPLE_QUEUE);
  const roomCode = 'CANTE-77';

  // Avança a fila quando uma música é finalizada ou pulada
  const handleNextTrack = () => {
    if (queue.length > 0) {
      const [nextSong, ...remainingQueue] = queue;
      setCurrentTrack({ ...nextSong, status: 'playing' });
      setQueue(remainingQueue);
    } else {
      setCurrentTrack(null);
    }
  };

  return (
    <main className="relative w-screen h-screen bg-[#1A1A2E] text-white overflow-hidden p-6 lg:p-8 flex flex-col font-sans">
      {/* 
        Iluminação de Fundo: Vinheta óptica sutil cinematográfica (zero neon, zero gradiente arco-íris).
        Gera profundidade de tela de cinema nas bordas da TV sem poluição visual.
      */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse at center, #1E1A38 0%, #131222 100%)',
        }}
        aria-hidden="true"
      />

      {/* Top Header Discreto da Aplicação */}
      <header className="flex items-center justify-between pb-4 select-none">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#9575CD]" />
          <h1 className="text-sm font-semibold tracking-widest text-white uppercase">
            Cante <span className="text-[#9575CD] font-normal font-mono text-xs">/ Palco</span>
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-xs text-white/40">
          <span>Sessão Ativa</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
      </header>

      {/* 
        Layout Assimétrico de 2 Colunas para TV (16:9 Cinema View):
        - Esquerda (~75%): Player com legendas de cinema e controles discretos.
        - Direita (~25%): Painel minimalista de fila "Up Next" com QR Code de entrada.
      */}
      <div className="flex-1 w-full grid grid-cols-12 gap-6 min-h-0">
        
        {/* Coluna Esquerda: Player de Vídeo e Letras (~75%) */}
        <section 
          className="col-span-12 lg:col-span-9 h-full min-h-0 flex flex-col"
          aria-label="Área de reprodução de vídeo e letras"
        >
          <VideoPlayer
            currentTrack={currentTrack}
            lyrics={SAMPLE_LYRICS}
            onTrackEnded={handleNextTrack}
            onSkipTrack={handleNextTrack}
          />
        </section>

        {/* Coluna Direita: Fila de Reprodução e QR Code (~25%) */}
        <section 
          className="col-span-12 lg:col-span-3 h-full min-h-0"
          aria-label="Fila de espera e código de acesso à sala"
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
