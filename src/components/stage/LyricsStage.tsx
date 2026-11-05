import React, { useRef, useEffect, useCallback } from 'react';
import { QueueItem, LyricLine } from '../../types/stage';

interface LyricsStageProps {
  currentTrack: QueueItem | null;
  lyrics: LyricLine[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isControlsVisible: boolean;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSkipTrack: () => void;
  onToggleMute: () => void;
  onChangeVolume: (volume: number) => void;
  onToggleFullscreen: () => void;
  onOpenProducer: () => void;
  onMouseMove: () => void;
}

export const LyricsStage: React.FC<LyricsStageProps> = ({
  currentTrack,
  lyrics,
  currentTime,
  duration,
  isPlaying,
  isControlsVisible,
  volume,
  isMuted,
  onTogglePlay,
  onSeek,
  onSkipTrack,
  onToggleMute,
  onChangeVolume,
  onToggleFullscreen,
  onOpenProducer,
  onMouseMove,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // Encontra a linha ativa atual com base no tempo de reprodução
  const activeIndex = lyrics.reduce((currIdx, line, idx) => {
    return currentTime >= line.time ? idx : currIdx;
  }, 0);

  // Auto-scroll suave mantendo a linha ativa centralizada na tela
  useEffect(() => {
    if (activeLineRef.current && scrollContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  // Formatação de tempo segura (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      onMouseMove={onMouseMove}
      className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none"
    >
      {/* 
        1. Top Bar Editorial da Música Atual:
        Apenas tipografia refinada flutuando sobre o fundo sólido #1A1A2E.
      */}
      <div className="flex items-start justify-between pb-4 pt-1 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9575CD] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-[#9575CD] uppercase">
              Tocando Agora
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-medium tracking-tight text-white">
            {currentTrack?.song.title || 'Selecione uma canção'}
          </h2>
          <p className="text-sm font-light text-white/40">
            {currentTrack?.song.artist}
          </p>
        </div>

        {currentTrack && (
          <div className="text-right pt-2">
            <p className="text-xs font-light text-white/40">
              Pedida por <span className="text-white/80 font-normal">{currentTrack.requestedBy}</span>
            </p>
          </div>
        )}
      </div>

      {/* 
        2. Tela de Letras Imersiva (Foco Total na Tipografia):
        Visual fluido estilo Apple Music / Spotify TV lyrics.
        A linha atual brilha em Soft Lavender (#9575CD) no centro da visão.
      */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto py-24 scroll-smooth scrollbar-none flex flex-col items-center space-y-10 lg:space-y-14 text-center px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {lyrics.length === 0 ? (
          <div className="my-auto opacity-30 space-y-2">
            <p className="text-xl font-light text-white">Nenhuma letra cadastrada</p>
            <button
              onClick={onOpenProducer}
              className="text-xs text-[#9575CD] hover:underline uppercase tracking-widest font-mono"
            >
              Abrir Modo Produtor para sincronizar
            </button>
          </div>
        ) : (
          lyrics.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;
            const isUpcoming = idx > activeIndex;

            return (
              <div
                key={line.id}
                ref={isActive ? activeLineRef : null}
                onClick={() => onSeek(line.time)}
                className={`cursor-pointer transition-all duration-700 ease-out max-w-4xl px-4 ${
                  isActive
                    ? 'scale-105 opacity-100'
                    : isPast
                    ? 'scale-95 opacity-25 hover:opacity-50'
                    : 'scale-95 opacity-35 hover:opacity-60'
                }`}
              >
                <p
                  className={`tracking-tight transition-colors duration-500 ${
                    isActive
                      ? 'text-[#9575CD] text-3xl sm:text-4xl lg:text-5xl font-medium drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] leading-tight'
                      : isPast
                      ? 'text-white text-xl sm:text-2xl lg:text-3xl font-light leading-snug'
                      : 'text-white text-xl sm:text-2xl lg:text-3xl font-light leading-snug'
                  }`}
                >
                  {line.text}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* 
        3. Barra de Controles Inferior Ultraminimalista:
        Flutuando discretamente na base, com atalho para o Modo Produtor.
      */}
      <div 
        className={`pt-6 pb-2 transition-opacity duration-300 shrink-0 ${
          isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-20 hover:opacity-100'
        }`}
      >
        {/* Scrubber de Linha Fina (2px) */}
        <div className="relative mb-4 group/scrubber cursor-pointer">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden transition-all group-hover/scrubber:h-1.5">
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
            onChange={(e) => onSeek(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Controle de posição"
          />
        </div>

        {/* Linha de Controles e Atalho Modo Produtor */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <button
              onClick={onTogglePlay}
              className="text-white hover:text-[#9575CD] transition-colors p-1"
              title={isPlaying ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}
            >
              {isPlaying ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Pular Faixa */}
            <button
              onClick={onSkipTrack}
              className="text-white/50 hover:text-white transition-colors p-1"
              title="Pular para a próxima música"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>

            {/* Tempo */}
            <span className="text-white/40 text-xs font-mono tracking-wider tabular-nums pl-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-5">
            {/* Botão Modo Produtor (Sincronizador) */}
            <button
              onClick={onOpenProducer}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-xs font-mono tracking-wider"
              title="Abrir editor de sincronização de letras"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#9575CD]" />
              <span>Modo Produtor</span>
            </button>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onToggleMute}
                className="text-white/40 hover:text-white transition-colors"
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
                onChange={(e) => onChangeVolume(Number(e.target.value))}
                className="w-16 h-1 bg-white/20 rounded-full accent-[#9575CD] cursor-pointer"
                aria-label="Volume"
              />
            </div>

            {/* Tela cheia */}
            <button
              onClick={onToggleFullscreen}
              className="text-white/40 hover:text-white transition-colors"
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
