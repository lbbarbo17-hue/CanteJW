import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QueueItem, LyricLine } from '../../types/stage';
import { LyricsSubtitle } from './LyricsSubtitle';

interface VideoPlayerProps {
  currentTrack: QueueItem | null;
  lyrics: LyricLine[];
  onTrackEnded?: () => void;
  onSkipTrack?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentTrack,
  lyrics,
  onTrackEnded,
  onSkipTrack,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(currentTrack?.song.duration || 222);
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Formatação minimalista de tempo (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulação precisa do tempo de reprodução
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            onTrackEnded?.();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, duration, onTrackEnded]);

  // Atualiza duração ao trocar de faixa
  useEffect(() => {
    if (currentTrack) {
      setDuration(currentTrack.song.duration);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  }, [currentTrack]);

  // Auto-hide suave dos controles após 2.5s de inatividade
  const handleMouseMove = useCallback(() => {
    setIsControlsVisible(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 2500);
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    setIsControlsVisible(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    setCurrentTime(targetTime);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(() => { });
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
      className="relative w-full h-full bg-[#121124] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group select-none transition-all"
    >
      {/* 
        1. Fundo do Palco Cinematográfico:
        Visual atmosférico ultra-sutil que dá vida à TV sem saturação, ruídos ou neon.
      */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Luz ambiente orgânica e lenta */}
        <div
          className={`absolute -top-1/4 -left-1/4 w-[150%] h-[150%] opacity-30 transition-opacity duration-1000 ${isPlaying ? 'opacity-30' : 'opacity-15'
            }`}
          style={{
            background: 'radial-gradient(circle at 40% 45%, #2a2046 0%, #161427 45%, #0e0d18 80%)',
          }}
        />

        {/* Linhas de luz tênues / grade anamórfica de cinema */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* 
        2. Top Bar Discreta e Elegante:
        Metadados integrados diretamente no topo com tipografia nobre (sem cartões ou pílulas pesadas).
      */}
      <div
        className={`relative z-20 flex items-start justify-between p-8 lg:p-10 transition-opacity duration-500 ${isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
      >
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9575CD] animate-pulse" />
            <span className="text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase">
              Tocando Agora
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-medium tracking-tight text-white/95">
            {currentTrack?.song.title || 'Palco Cante Pronto'}
          </h2>
          <p className="text-xs lg:text-sm font-light text-white/40">
            {currentTrack?.song.artist}
          </p>
        </div>

        {currentTrack && (
          <div className="text-right pt-1">
            <p className="text-xs lg:text-sm font-light text-white/40">
              Pedida por <span className="text-white/80 font-normal">{currentTrack.requestedBy}</span>
            </p>
          </div>
        )}
      </div>

      {/* 
        3. Área de Legendas Sobreposta em Modo Imersivo:
        Zero caixas isoladas. Comportamento idêntico a legendas de cinema de alto padrão.
      */}
      <LyricsSubtitle lyrics={lyrics} currentTime={currentTime} />

      {/* 
        4. Barra de Controles Inferior Ultraminimalista:
        Aparece apenas quando o usuário interage ou quando o vídeo é pausado.
      */}
      <div
        className={`relative z-20 px-8 lg:px-10 pb-8 pt-16 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 ${isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Scrubber de Linha Fina (2px) sem molduras pesadas */}
        <div className="relative mb-5 group/scrubber cursor-pointer">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden transition-all duration-200 group-hover/scrubber:h-1.5">
            <div
              className="h-full bg-[#9575CD] rounded-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Controle de posição da música"
          />
        </div>

        {/* Linha de Ações e Tempo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-5">
            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 active:scale-95 text-white/90 hover:text-white flex items-center justify-center transition-all"
              title={isPlaying ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}
            >
              {isPlaying ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Pular Faixa */}
            <button
              onClick={onSkipTrack}
              className="w-9 h-9 rounded-full bg-transparent hover:bg-white/10 active:scale-95 text-white/50 hover:text-white flex items-center justify-center transition-all"
              title="Pular para a próxima música"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>

            {/* Marcador de Tempo Discreto */}
            <span className="text-white/40 text-xs font-mono tracking-wider tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-6">
            {/* Controle de Volume */}
            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className="text-white/40 hover:text-white/80 transition-colors"
                title={isMuted ? 'Desativar Mudo' : 'Silenciar'}
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  setIsMuted(false);
                }}
                className="w-16 h-1 bg-white/10 rounded-full accent-[#9575CD] cursor-pointer"
                aria-label="Volume"
              />
            </div>

            {/* Botão de Tela Cheia */}
            <button
              onClick={toggleFullscreen}
              className="text-white/40 hover:text-white/80 transition-colors"
              title="Tela Cheia (F)"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
