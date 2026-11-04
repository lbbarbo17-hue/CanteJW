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
  const [duration, setDuration] = useState<number>(currentTrack?.song.duration || 215);
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Formatação de tempo segura (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulação / Atualização do tempo de reprodução
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

  // Gestão de visibilidade dos controles com debounce (auto-hide após 3s)
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
      containerRef.current.requestFullscreen().catch(() => {});
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
      className="relative w-full h-full bg-[#131222] rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl flex flex-col justify-between group select-none"
    >
      {/* 1. Backdrop / Mock de Vídeo Cinematográfico (Substituível por tag <video> real) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1b1730] via-[#151325] to-[#0f0e1a] flex items-center justify-center">
        {/* Simulação sutil de iluminação de palco focada */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-black/60 pointer-events-none" 
          aria-hidden="true" 
        />
        
        {/* Placeholder elegante caso o vídeo esteja carregando */}
        <div className="text-center space-y-3 z-0 opacity-40">
          <div className="w-16 h-16 mx-auto rounded-full border border-white/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-white/40 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="text-white/40 text-sm font-medium tracking-wider uppercase">
            {currentTrack?.song.title || 'Palco Cante Ativo'}
          </p>
        </div>
      </div>

      {/* 2. Top Bar Discreta (Título da Canção e Badge Ao Vivo) */}
      <div 
        className={`relative z-20 flex items-center justify-between p-6 transition-opacity duration-300 ${
          isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center space-x-3 bg-[#4A148C]/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/[0.08]">
          <span className="w-2 h-2 rounded-full bg-[#9575CD] animate-pulse" />
          <span className="text-white text-xs font-semibold tracking-wider uppercase">
            Em Reprodução
          </span>
          <span className="text-white/30 text-xs">|</span>
          <span className="text-white/80 text-xs font-medium">
            {currentTrack?.song.title}
          </span>
        </div>

        {currentTrack && (
          <div className="text-right">
            <span className="text-xs text-white/50 tracking-wide">
              Pedida por <strong className="text-[#9575CD] font-medium">{currentTrack.requestedBy}</strong>
            </span>
          </div>
        )}
      </div>

      {/* 3. Área de Legendas Sincronizadas Estilo Cinema */}
      <LyricsSubtitle lyrics={lyrics} currentTime={currentTime} />

      {/* 4. Barra de Controles Inferior (Discreta, aparece em hover ou pause) */}
      <div
        className={`relative z-20 px-6 pb-6 pt-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
          isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Barra de Progresso / Scrubber */}
        <div className="relative mb-4 group/scrubber cursor-pointer">
          <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#9575CD] transition-all duration-150 rounded-full"
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
            aria-label="Controle de tempo da música"
          />
        </div>

        {/* Linha de Botões e Metadados de Tempo */}
        <div className="flex items-center justify-between">
          {/* Controles de Reprodução Esquerda */}
          <div className="flex items-center space-x-4">
            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all border border-white/[0.08]"
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

            {/* Pular Faixa (Skip) */}
            <button
              onClick={onSkipTrack}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 active:scale-95 text-white/80 hover:text-white flex items-center justify-center transition-all border border-white/[0.05]"
              title="Pular para a próxima música"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>

            {/* Contador de Tempo */}
            <span className="text-white/70 text-xs font-mono tracking-wider pl-2 tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Controles Direita: Volume e Tela Cheia */}
          <div className="flex items-center space-x-5">
            {/* Mudo / Volume */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className="text-white/60 hover:text-white transition-colors"
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
                className="w-16 h-1 bg-white/20 rounded-full accent-[#9575CD] cursor-pointer"
                aria-label="Controle de volume"
              />
            </div>

            {/* Tela Cheia (Fullscreen) */}
            <button
              onClick={toggleFullscreen}
              className="text-white/60 hover:text-white transition-colors"
              title="Alternar Tela Cheia (F)"
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
