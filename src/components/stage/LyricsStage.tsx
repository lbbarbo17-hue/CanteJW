import React from 'react';
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
  // Identifica o índice da linha ativa atual
  const activeIndex = lyrics.reduce((currIdx, line, idx) => {
    return currentTime >= line.time ? idx : currIdx;
  }, 0);

  // Seleciona estritamente as 3 linhas do teleprompter (anterior, atual, próxima)
  const prevLine = activeIndex > 0 ? lyrics[activeIndex - 1] : null;
  const currentLine = lyrics[activeIndex] || null;
  const nextLine = activeIndex < lyrics.length - 1 ? lyrics[activeIndex + 1] : null;

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
      className="relative w-full h-full flex flex-col justify-between select-none"
    >
      {/* 
        1. CABEÇALHO ELEGANTE DE ALTA-COSTURA (ZERO PLAYER DE VÍDEO):
        - Topo Esquerdo: Título da música em destaque tipográfico absoluto em Branco #FFFFFF.
        - Abaixo: Artista / Gênero de forma sutil e discreta.
        - Acima: Selo sutil "TOCANDO AGORA".
        - Topo Direito: Apelido de quem pediu a faixa.
      */}
      <div className="flex items-start justify-between shrink-0 pt-2 pb-6">
        <div className="space-y-1.5 max-w-2xl">
          {/* Selo sutil "tocando agora" */}
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9575CD] animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.25em] text-[#9575CD] uppercase font-medium">
              Tocando Agora
            </span>
          </div>

          {/* Título da Música em destaque tipográfico absoluto em Branco #FFFFFF */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
            {currentTrack?.song.title || 'Selecione uma canção'}
          </h2>

          {/* Artista e Gênero discreto */}
          <p className="text-sm lg:text-base font-light text-white/40 tracking-wide">
            {currentTrack?.song.artist}
          </p>
        </div>

        {/* Quem pediu a faixa */}
        {currentTrack && (
          <div className="text-right pt-2 shrink-0">
            <p className="text-xs lg:text-sm font-light text-white/40">
              Pedida por <span className="text-white font-normal">{currentTrack.requestedBy}</span>
            </p>
          </div>
        )}
      </div>

      {/* 
        2. PAINEL CENTRAL DE LETRAS (FLUXO TELEPROMPTER DE 3 LINHAS):
        Apenas 3 linhas por vez:
        - Linha anterior: menor, opaca, sutil.
        - Linha atual: grande, centralizada, em Soft Lavender (#9575CD).
        - Próxima linha: abaixo, com opacidade suave.
        Zero caixas, zero bordas, zero fundos coloridos. Tipografia pura.
      */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
        <div className="max-w-4xl w-full flex flex-col items-center justify-center space-y-6 lg:space-y-8">
          
          {/* Linha Anterior (Menor e Opaca) */}
          <div className="h-10 lg:h-12 flex items-center justify-center">
            {prevLine ? (
              <p 
                onClick={() => onSeek(prevLine.time)}
                className="text-white/30 text-lg sm:text-xl lg:text-2xl font-light tracking-wide cursor-pointer hover:text-white/50 transition-all duration-500"
              >
                {prevLine.text}
              </p>
            ) : null}
          </div>

          {/* Linha Atual Ativa (Grande, Centralizada, em Soft Lavender #9575CD) */}
          <div className="min-h-[4rem] sm:min-h-[5rem] lg:min-h-[6rem] flex items-center justify-center">
            {currentLine ? (
              <p 
                key={currentLine.id}
                className="text-[#9575CD] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight leading-tight transition-all duration-500 animate-fadeIn"
              >
                {currentLine.text}
              </p>
            ) : (
              <p className="text-white/30 text-2xl font-light">
                ♪ Aguardando música...
              </p>
            )}
          </div>

          {/* Próxima Linha (Abaixo, com Opacidade Suave) */}
          <div className="h-10 lg:h-12 flex items-center justify-center">
            {nextLine ? (
              <p 
                onClick={() => onSeek(nextLine.time)}
                className="text-white/40 text-lg sm:text-xl lg:text-2xl font-light tracking-wide cursor-pointer hover:text-white/60 transition-all duration-500"
              >
                {nextLine.text}
              </p>
            ) : null}
          </div>

        </div>
      </div>

      {/* 
        3. BARRA INFERIOR DE CONTROLES E PROGRESSO DISCRETA:
        Totalmente integrada ao fundo, sem caixas pesadas.
      */}
      <div 
        className={`pt-6 pb-2 transition-opacity duration-300 shrink-0 ${
          isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-25 hover:opacity-100'
        }`}
      >
        {/* Scrubber de Linha Fina (1px / 2px) */}
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

        {/* Linha de Ações: Play, Skip, Tempo, Modo Produtor e Volume */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
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

            <button
              onClick={onSkipTrack}
              className="text-white/40 hover:text-white transition-colors p-1"
              title="Pular para a próxima música"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>

            <span className="text-white/35 text-xs font-mono tracking-wider tabular-nums pl-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-5">
            {/* Atalho para o Modo Produtor */}
            <button
              onClick={onOpenProducer}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors text-xs font-mono tracking-wider"
              title="Abrir sincronizador de timestamps (Atalho: P)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#9575CD]" />
              <span>Modo Produtor</span>
            </button>

            {/* Controle de Volume */}
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
