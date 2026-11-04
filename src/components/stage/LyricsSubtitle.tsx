import React from 'react';
import { LyricLine } from '../../types/stage';

interface LyricsSubtitleProps {
  lyrics: LyricLine[];
  currentTime: number;
}

export const LyricsSubtitle: React.FC<LyricsSubtitleProps> = ({ lyrics, currentTime }) => {
  // Encontra o índice da linha ativa atual com base no timestamp
  const activeIndex = lyrics.reduce((currIdx, line, idx) => {
    return currentTime >= line.time ? idx : currIdx;
  }, 0);

  const prevLine = activeIndex > 0 ? lyrics[activeIndex - 1] : null;
  const currentLine = lyrics[activeIndex] || null;
  const nextLine = activeIndex < lyrics.length - 1 ? lyrics[activeIndex + 1] : null;

  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none z-10 flex flex-col items-center justify-end pb-12 px-8">
      {/* Degrade suave de cinema na base do vídeo para contraste perfeito sobre qualquer cena */}
      <div 
        className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/45 to-transparent -z-10" 
        aria-hidden="true" 
      />

      <div className="flex flex-col items-center text-center space-y-2 max-w-4xl w-full select-none">
        {/* Linha Anterior (Contexto - Opacidade Reduzida) */}
        {prevLine ? (
          <p className="text-white/35 text-base lg:text-lg font-normal tracking-wide transition-opacity duration-300">
            {prevLine.text}
          </p>
        ) : (
          <div className="h-6" aria-hidden="true" />
        )}

        {/* Linha Ativa (Destaque Principal - Soft Lavender) */}
        {currentLine ? (
          <p className="text-[#9575CD] text-2xl lg:text-4xl font-semibold tracking-wide leading-tight drop-shadow-sm transition-all duration-200">
            {currentLine.text}
          </p>
        ) : (
          <p className="text-white/60 text-xl font-medium tracking-wide">
            Preparando clipe musical...
          </p>
        )}

        {/* Próxima Linha (Preview para o Cantor se Preparar) */}
        {nextLine ? (
          <p className="text-white/50 text-base lg:text-lg font-light tracking-wide transition-opacity duration-300">
            {nextLine.text}
          </p>
        ) : (
          <div className="h-6" aria-hidden="true" />
        )}
      </div>
    </div>
  );
};
