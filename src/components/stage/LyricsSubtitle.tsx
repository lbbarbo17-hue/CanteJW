import React from 'react';
import { LyricLine } from '../../types/stage';

interface LyricsSubtitleProps {
  lyrics: LyricLine[];
  currentTime: number;
}

export const LyricsSubtitle: React.FC<LyricsSubtitleProps> = ({ lyrics, currentTime }) => {
  // Identifica a linha ativa atual através do timestamp
  const activeIndex = lyrics.reduce((currIdx, line, idx) => {
    return currentTime >= line.time ? idx : currIdx;
  }, 0);

  const prevLine = activeIndex > 0 ? lyrics[activeIndex - 1] : null;
  const currentLine = lyrics[activeIndex] || null;
  const nextLine = activeIndex < lyrics.length - 1 ? lyrics[activeIndex + 1] : null;

  return (
    <div className="absolute inset-x-0 bottom-8 lg:bottom-12 z-20 pointer-events-none flex flex-col items-center justify-end px-8 select-none">
      {/* 
        Faixa preta translúcida imperceptível que garante leitura cinematográfica 
        em qualquer cena sem criar caixas ou quebrar a tela.
      */}
      <div 
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      <div className="flex flex-col items-center text-center max-w-4xl w-full space-y-2">
        {/* Linha anterior: branco com 40% de opacidade */}
        <div className="h-7 flex items-center justify-center">
          {prevLine ? (
            <p className="text-white/40 text-base lg:text-lg font-normal tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-opacity duration-500">
              {prevLine.text}
            </p>
          ) : null}
        </div>

        {/* Linha ativa: tipografia limpa em Soft Lavender (#9575CD) com leve sombra de texto */}
        <div className="min-h-[3.5rem] lg:min-h-[4.5rem] flex items-center justify-center">
          {currentLine ? (
            <p 
              key={currentLine.id}
              className="text-[#9575CD] text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] animate-fadeIn"
            >
              {currentLine.text}
            </p>
          ) : (
            <p className="text-white/40 text-xl font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              ♪ Aguardando música...
            </p>
          )}
        </div>

        {/* Próxima linha para antecipação sutil do cantor */}
        <div className="h-7 flex items-center justify-center">
          {nextLine ? (
            <p className="text-white/40 text-base lg:text-lg font-light tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-opacity duration-500">
              {nextLine.text}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
