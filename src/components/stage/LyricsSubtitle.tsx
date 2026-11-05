import React from 'react';
import { LyricLine } from '../../types/stage';

interface LyricsSubtitleProps {
  lyrics: LyricLine[];
  currentTime: number;
}

export const LyricsSubtitle: React.FC<LyricsSubtitleProps> = ({ lyrics, currentTime }) => {
  // Identifica a linha ativa atual através da timestamp
  const activeIndex = lyrics.reduce((currIdx, line, idx) => {
    return currentTime >= line.time ? idx : currIdx;
  }, 0);

  const prevLine = activeIndex > 0 ? lyrics[activeIndex - 1] : null;
  const currentLine = lyrics[activeIndex] || null;
  const nextLine = activeIndex < lyrics.length - 1 ? lyrics[activeIndex + 1] : null;

  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none z-10 flex flex-col items-center justify-end pb-8 lg:pb-12 px-6 sm:px-12 select-none">
      {/* 
        Gradiente translúcido cinematográfico ultrafino.
        Garante legibilidade absoluta em qualquer quadro claro ou escuro sem criar blocos/caixas na tela.
      */}
      <div 
        className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#1A1A2E]/95 via-[#1A1A2E]/40 to-transparent pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      <div className="flex flex-col items-center text-center max-w-4xl w-full">
        {/* Linha Anterior (Contexto sutil - transição suave) */}
        <div className="h-7 lg:h-8 flex items-center justify-center">
          {prevLine ? (
            <p className="text-white/25 text-sm lg:text-base font-light tracking-wide transition-opacity duration-700">
              {prevLine.text}
            </p>
          ) : null}
        </div>

        {/* Linha Ativa (Legenda de Cinema em Soft Lavender #9575CD com tipografia limpa e peso refinado) */}
        <div className="min-h-[3.5rem] lg:min-h-[4.5rem] flex items-center justify-center my-1.5 lg:my-2">
          {currentLine ? (
            <p 
              key={currentLine.id}
              className="text-[#9575CD] text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium tracking-tight leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.85)] animate-fadeIn"
            >
              {currentLine.text}
            </p>
          ) : (
            <p className="text-white/40 text-lg lg:text-xl font-light tracking-wide">
              Aguardando introdução...
            </p>
          )}
        </div>

        {/* Próxima Linha (Antecipação para o cantor, elegante e sem ruído visual) */}
        <div className="h-7 lg:h-8 flex items-center justify-center">
          {nextLine ? (
            <p className="text-white/40 text-sm lg:text-base font-light tracking-wide transition-opacity duration-700">
              {nextLine.text}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
