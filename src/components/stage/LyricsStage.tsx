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

  // Formatação segura de tempo (mm:ss)
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
        1. CABEÇALHO DA COLUNA ESQUERDA:
        - Canto superior esquerdo: APENAS a Logo "CANTE" em Branco Puro (#FFFFFF) com ponto em Soft Lavender (#9575CD).
        - Canto superior direito da coluna: Botão discreto do Modo Produtor com efeito glassmorphism sutil.
        - Nenhuma informação de música fica solta ou colada horizontalmente no topo da tela.
      */}
      <header className="flex items-center justify-between shrink-0 pt-1 pb-4">
        {/* Logo Minimalista Cante */}
        <div className="flex items-center">
          <span className="text-white font-light text-base lg:text-lg tracking-[0.35em] uppercase">
            CANTE
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#9575CD] ml-2 mb-0.5" />
        </div>

        {/* Botão de Alta Estética para o Modo Produtor */}
        <button
          onClick={onOpenProducer}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-md border border-[#4A148C]/70 hover:border-[#9575CD]/60 text-white/70 hover:text-white transition-all duration-300 text-xs font-mono tracking-wider active:scale-95"
          title="Abrir sincronizador de timestamps (Atalho: P)"
        >
          <svg 
            className="w-3.5 h-3.5 text-[#9575CD]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="1.8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span>Modo Produtor</span>
          <span className="text-[10px] text-white/30 font-mono">[P]</span>
        </button>
      </header>

      {/* 
        2. BLOCO CENTRAL: METADADOS DA MÚSICA ATUAL + PALCO TIPOGRÁFICO DE LETRAS
        - Acima: Bloco de metadados discreto e elegante centralizado (título moderado + artista/quem pediu acinzentado).
        - Abaixo: Palco de 3 linhas do teleprompter (anterior, ativa em #9575CD, próxima) com respiro vertical total.
      */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-4 min-h-0">
        
        {/* Bloco de Metadados Centralizado (Discreto e Elegante) */}
        {currentTrack && (
          <div className="mb-6 lg:mb-8 space-y-1">
            <h2 className="text-xl lg:text-2xl font-medium tracking-tight text-white/95">
              {currentTrack.song.title}
            </h2>
            <p className="text-xs lg:text-sm font-light text-white/40 tracking-wide">
              {currentTrack.song.artist} <span className="text-white/20 mx-1.5">•</span> Pedida por <span className="text-white/70 font-normal">{currentTrack.requestedBy}</span>
            </p>
          </div>
        )}

        {/* Palco Tipográfico de Letras (Estritamente 3 Linhas / Fluxo Teleprompter) */}
        <div className="max-w-4xl w-full flex flex-col items-center justify-center space-y-7 lg:space-y-10">
          
          {/* Linha Anterior (Sutil e Opaca) */}
          <div className="h-10 lg:h-12 flex items-center justify-center">
            {prevLine ? (
              <p 
                onClick={() => onSeek(prevLine.time)}
                className="text-white/25 text-lg sm:text-xl lg:text-2xl font-light tracking-wide cursor-pointer hover:text-white/45 transition-all duration-700"
              >
                {prevLine.text}
              </p>
            ) : (
              <div className="h-6" aria-hidden="true" />
            )}
          </div>

          {/* Linha Atual Ativa (Em Destaque Absoluto - Soft Lavender #9575CD) */}
          <div className="min-h-[4.5rem] sm:min-h-[5.5rem] lg:min-h-[6.5rem] flex items-center justify-center px-2">
            {currentLine ? (
              <p 
                key={currentLine.id}
                className="text-[#9575CD] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-tight leading-tight transition-all duration-500 animate-fadeIn"
              >
                {currentLine.text}
              </p>
            ) : (
              <p className="text-white/20 text-2xl font-light">
                ♪ Aguardando introdução...
              </p>
            )}
          </div>

          {/* Próxima Linha (Abaixo com Opacidade Suave) */}
          <div className="h-10 lg:h-12 flex items-center justify-center">
            {nextLine ? (
              <p 
                onClick={() => onSeek(nextLine.time)}
                className="text-white/35 text-lg sm:text-xl lg:text-2xl font-light tracking-wide cursor-pointer hover:text-white/55 transition-all duration-700"
              >
                {nextLine.text}
              </p>
            ) : (
              <div className="h-6" aria-hidden="true" />
            )}
          </div>

        </div>
      </div>

      {/* 
        3. BARRA DE CONTROLE INFERIOR FLUTUANTE:
        - Ancorada na parte inferior da coluna esquerda.
        - Margens (padding) generosas para nunca encostar nas bordas da tela.
        - Ícones minimalistas e linha de progresso ultrafina em Soft Lavender (#9575CD).
      */}
      <div 
        className={`pt-6 pb-4 px-2 transition-opacity duration-300 shrink-0 ${
          isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-20 hover:opacity-100'
        }`}
      >
        {/* Linha de Progresso Ultrafina (1px / 2px) */}
        <div className="relative mb-4 group/scrubber cursor-pointer">
          <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden transition-all group-hover/scrubber:h-1">
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
            aria-label="Controle de posição da música"
          />
        </div>

        {/* Linha de Ações: Play, Skip, Marcador de Tempo, Volume e Fullscreen */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-5">
            {/* Play / Pause */}
            <button
              onClick={onTogglePlay}
              className="text-white/80 hover:text-white transition-colors p-1"
              title={isPlaying ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}
            >
              {isPlaying ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Pular Faixa */}
            <button
              onClick={onSkipTrack}
              className="text-white/35 hover:text-white transition-colors p-1"
              title="Pular para a próxima música"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>

            {/* Marcador de Tempo Discreto */}
            <span className="text-white/30 text-xs font-mono tracking-wider tabular-nums pl-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-6">
            {/* Controle de Volume Minimalista */}
            <div className="flex items-center space-x-2.5">
              <button
                onClick={onToggleMute}
                className="text-white/35 hover:text-white transition-colors"
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
                className="w-16 h-0.5 bg-white/15 rounded-full accent-[#9575CD] cursor-pointer"
                aria-label="Volume"
              />
            </div>

            {/* Alternar Tela Cheia */}
            <button
              onClick={onToggleFullscreen}
              className="text-white/35 hover:text-white transition-colors"
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
