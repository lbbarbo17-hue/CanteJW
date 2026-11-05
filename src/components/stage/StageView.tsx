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

// Letras Sincronizadas por Segundos (Estilo Teleprompter de Alta-Costura)
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
    <main className="w-screen h-screen bg-[#1A1A2E] text-white overflow-hidden p-8 lg:p-12 font-sans select-none">
      {/* 
        ESTRUTURA DE LAYOUT (CSS GRID / 2 COLUNAS):
        - Fundo sólido Deep Royal Purple (#1A1A2E) em tela cheia.
        - COLUNA ESQUERDA (~75% da largura): Área principal do palco. Contém no topo esquerdo a Logo "CANTE".
          No centro, o Bloco de Metadados da Música Atual + Palco Tipográfico de Letras (3 linhas).
          Na parte inferior, a barra de controle de áudio flutuante com padding generoso.
        - COLUNA DIREITA (~25% da largura): Painel lateral de suporte. Contém a Fila de Reprodução ("A Seguir")
          no topo e o QR Code centralizado na parte inferior. Tudo flutua limpo usando apenas espaçamento (whitespace).
      */}
      <div className="w-full h-full grid grid-cols-12 gap-10 lg:gap-16 min-h-0">
        
        {/* COLUNA ESQUERDA (~75% da largura) */}
        <section 
          className="col-span-12 lg:col-span-8 xl:col-span-9 h-full min-h-0 flex flex-col justify-between"
          aria-label="Palco principal de letras e controles"
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

        {/* COLUNA DIREITA (~25% da largura) */}
        <section 
          className="col-span-12 lg:col-span-4 xl:col-span-3 h-full min-h-0 flex flex-col justify-between"
          aria-label="Fila de reprodução e código de acesso"
        >
          <QueueSidebar
            queue={queue}
            roomCode={roomCode}
          />
        </section>

      </div>

      {/* 
        MODAL DO MODO PRODUTOR:
        Sincronizador prático de timestamps ao vivo acionado sob demanda.
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
