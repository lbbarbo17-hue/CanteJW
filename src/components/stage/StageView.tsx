import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LyricsStage } from './LyricsStage';
import { QueueSidebar } from './QueueSidebar';
import { ProducerModal } from './ProducerModal';
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
  const [lyrics, setLyrics] = useState<LyricLine[]>(SAMPLE_LYRICS);
  const [isProducerOpen, setIsProducerOpen] = useState<boolean>(false);

  // Estados de Reprodução de Áudio
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(currentTrack?.song.duration || 222);
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const roomCode = 'CANTE-77';

  // Temporizador de reprodução
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, duration]);

  // Atualiza duração ao trocar de faixa
  useEffect(() => {
    if (currentTrack) {
      setDuration(currentTrack.song.duration);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  }, [currentTrack]);

  // Avança a fila quando uma música é finalizada ou pulada
  const handleNextTrack = useCallback(() => {
    if (queue.length > 0) {
      const [nextSong, ...remainingQueue] = queue;
      setCurrentTrack({ ...nextSong, status: 'playing' });
      setQueue(remainingQueue);
      setCurrentTime(0);
    } else {
      setCurrentTrack(null);
    }
  }, [queue]);

  // Gestão de visibilidade dos controles
  const handleMouseMove = useCallback(() => {
    setIsControlsVisible(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 3000);
    }
  }, [isPlaying]);

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
    setIsControlsVisible(true);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Suporte a atalhos de teclado (P para Modo Produtor, Shift+Right para Pular, Espaço para Pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'p' || e.key === 'P') {
        setIsProducerOpen((prev) => !prev);
      } else if (e.key === ' ' && !isProducerOpen) {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'ArrowRight' && e.shiftKey) {
        handleNextTrack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProducerOpen, handleNextTrack]);

  return (
    <main className="w-screen h-screen bg-[#1A1A2E] text-white overflow-hidden p-8 lg:p-10 flex flex-col font-sans select-none">
      {/* 
        1. Top Bar Editorial:
        Apenas tipografia pura e respiração visual sobre o fundo sólido #1A1A2E.
      */}
      <header className="flex items-center justify-between pb-6 select-none shrink-0">
        <div className="flex items-center space-x-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9575CD]" />
          <h1 className="text-xs font-semibold tracking-[0.25em] uppercase text-white/80">
            Cante <span className="text-white/30 font-light tracking-[0.2em]">/ MODO LETRAS</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsProducerOpen(true)}
            className="flex items-center space-x-2 text-xs font-mono text-white/40 hover:text-white transition-colors"
            title="Abrir sincronizador de timestamps (Atalho: P)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#9575CD]" />
            <span>MODO PRODUTOR</span>
            <span className="text-[10px] text-white/20">[P]</span>
          </button>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-white/30 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>AO VIVO</span>
          </div>
        </div>
      </header>

      {/* 
        2. Layout Principal de 2 Colunas:
        - Esquerda (~74%): Tela de Letras Imersiva pura (foco total na tipografia).
        - Direita (~26%): Lista da fila e QR Code flutuando diretamente no fundo escuro.
        - Separação feita exclusivamente por espaçamento em branco (whitespace).
      */}
      <div className="flex-1 w-full grid grid-cols-12 gap-8 lg:gap-14 min-h-0">
        {/* Coluna Central da Tela de Letras */}
        <section 
          className="col-span-12 lg:col-span-8 xl:col-span-9 h-full min-h-0 flex flex-col"
          aria-label="Tela de letras em foco tipográfico"
        >
          <LyricsStage
            currentTrack={currentTrack}
            lyrics={lyrics}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            isControlsVisible={isControlsVisible}
            volume={volume}
            isMuted={isMuted}
            onTogglePlay={handleTogglePlay}
            onSeek={handleSeek}
            onSkipTrack={handleNextTrack}
            onToggleMute={() => setIsMuted((prev) => !prev)}
            onChangeVolume={setVolume}
            onToggleFullscreen={handleToggleFullscreen}
            onOpenProducer={() => setIsProducerOpen(true)}
            onMouseMove={handleMouseMove}
          />
        </section>

        {/* Coluna da Fila e QR Code (Flutuando diretamente no fundo #1A1A2E) */}
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

      {/* 
        3. Modal do Modo Produtor:
        Editor prático de timestamps para sincronização ao vivo das letras.
      */}
      <ProducerModal
        isOpen={isProducerOpen}
        onClose={() => setIsProducerOpen(false)}
        currentTrack={currentTrack}
        lyrics={lyrics}
        currentTime={currentTime}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onSeek={handleSeek}
        onSaveLyrics={(newLyrics) => setLyrics(newLyrics)}
      />
    </main>
  );
};

export default StageView;
