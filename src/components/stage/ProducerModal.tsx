import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LyricLine, QueueItem } from '../../types/stage';

interface ProducerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: QueueItem | null;
  lyrics: LyricLine[];
  currentTime: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSaveLyrics: (newLyrics: LyricLine[]) => void;
}

export const ProducerModal: React.FC<ProducerModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  lyrics: initialLyrics,
  currentTime,
  isPlaying,
  onTogglePlay,
  onSeek,
  onSaveLyrics,
}) => {
  const [editableLyrics, setEditableLyrics] = useState<LyricLine[]>(initialLyrics);
  const [activeVerseIndex, setActiveVerseIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'sync' | 'paste'>('sync');
  const [rawText, setRawText] = useState<string>('');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const listContainerRef = useRef<HTMLDivElement>(null);
  const activeRowRef = useRef<HTMLDivElement>(null);

  // Sincroniza estado com as letras atuais ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setEditableLyrics(initialLyrics);
      setActiveVerseIndex(0);
      setCopiedFormat(null);
    }
  }, [isOpen, initialLyrics]);

  // Rola automaticamente para manter o verso selecionado visível
  useEffect(() => {
    if (activeRowRef.current && listContainerRef.current) {
      activeRowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeVerseIndex]);

  // Formatação de segundos para mm:ss.s
  const formatTimecode = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Marca o timestamp do verso selecionado com o tempo atual e avança para o próximo
  const handleMarkCurrentVerse = useCallback(() => {
    if (editableLyrics.length === 0) return;

    const roundedTime = Math.floor(currentTime);

    setEditableLyrics((prev) => {
      const updated = [...prev];
      if (activeVerseIndex < updated.length) {
        updated[activeVerseIndex] = {
          ...updated[activeVerseIndex],
          time: roundedTime,
        };
      }
      return updated;
    });

    // Avança para o próximo verso se houver
    if (activeVerseIndex < editableLyrics.length - 1) {
      setActiveVerseIndex((prev) => prev + 1);
    }
  }, [currentTime, activeVerseIndex, editableLyrics.length]);

  // Atalhos de teclado para o Modo Produtor
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Se estiver digitando na textarea, não intercepta
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleMarkCurrentVerse();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveVerseIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveVerseIndex((prev) => Math.min(editableLyrics.length - 1, prev + 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleMarkCurrentVerse, editableLyrics.length, onClose]);

  // Carrega texto colado como novas linhas de letra
  const handleLoadRawText = () => {
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    const parsedLyrics: LyricLine[] = lines.map((text, idx) => ({
      id: `line-${Date.now()}-${idx}`,
      time: 0,
      text,
    }));

    setEditableLyrics(parsedLyrics);
    setActiveVerseIndex(0);
    setActiveTab('sync');
  };

  // Salva e aplica imediatamente na música atual
  const handleApply = () => {
    onSaveLyrics(editableLyrics);
    onClose();
  };

  // Exporta em formato JSON
  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(editableLyrics, null, 2));
    setCopiedFormat('JSON');
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  // Exporta em formato LRC padrão de karaokê
  const handleCopyLRC = () => {
    const lrcLines = editableLyrics.map((l) => {
      const mins = Math.floor(l.time / 60).toString().padStart(2, '0');
      const secs = (l.time % 60).toString().padStart(2, '0');
      return `[${mins}:${secs}.00]${l.text}`;
    });
    navigator.clipboard.writeText(lrcLines.join('\n'));
    setCopiedFormat('LRC');
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  // Limpa todos os timestamps para recomeçar a sincronização
  const handleResetTimestamps = () => {
    setEditableLyrics((prev) => prev.map((l) => ({ ...l, time: 0 })));
    setActiveVerseIndex(0);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#1A1A2E]/95 backdrop-blur-md flex items-center justify-center p-6 select-none animate-fadeIn"
      role="dialog"
      aria-label="Modo Produtor de Sincronização de Letras"
    >
      <div className="w-full max-w-4xl h-[88vh] bg-[#121124] rounded-3xl p-8 flex flex-col justify-between shadow-2xl border border-white/[0.04]">
        
        {/* 1. Header do Modo Produtor */}
        <div className="flex items-start justify-between pb-6 border-b border-white/[0.04]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#9575CD]" />
              <span className="text-xs font-mono tracking-widest text-[#9575CD] uppercase">
                Modo Produtor
              </span>
            </div>
            <h2 className="text-xl font-medium text-white tracking-tight">
              Sincronizador de Letras & Timestamps
            </h2>
            <p className="text-xs text-white/40 font-light">
              Música: <span className="text-white/80">{currentTrack?.song.title || 'Sem faixa selecionada'}</span>
            </p>
          </div>

          {/* Abas e Botão Fechar */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white/5 p-1 rounded-full text-xs font-mono">
              <button
                onClick={() => setActiveTab('sync')}
                className={`px-4 py-1.5 rounded-full transition-colors ${
                  activeTab === 'sync'
                    ? 'bg-[#9575CD] text-white font-medium'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                Sincronizar ao Vivo
              </button>
              <button
                onClick={() => setActiveTab('paste')}
                className={`px-4 py-1.5 rounded-full transition-colors ${
                  activeTab === 'paste'
                    ? 'bg-[#9575CD] text-white font-medium'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                Colar Letra
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors p-2 text-sm"
              title="Fechar (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 2. Área Central de Conteúdo */}
        {activeTab === 'sync' ? (
          <div className="flex-1 flex flex-col min-h-0 py-6">
            {/* Barra de Tempo e Controle de Áudio */}
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-mono text-[#9575CD] font-medium tabular-nums">
                  {formatTimecode(currentTime)}
                </span>
                
                <button
                  onClick={onTogglePlay}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-white/80 transition-colors"
                >
                  {isPlaying ? 'Pausar Áudio' : 'Tocar Áudio'}
                </button>

                <button
                  onClick={() => onSeek(Math.max(0, currentTime - 5))}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-white/60 transition-colors"
                  title="Voltar 5 segundos"
                >
                  -5s
                </button>

                <button
                  onClick={() => onSeek(currentTime + 5)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-white/60 transition-colors"
                  title="Avançar 5 segundos"
                >
                  +5s
                </button>
              </div>

              <div className="flex items-center space-x-2 text-xs text-white/40">
                <span className="font-mono">Verso {activeVerseIndex + 1} de {editableLyrics.length}</span>
              </div>
            </div>

            {/* Lista dos Versos para Sincronização */}
            <div 
              ref={listContainerRef}
              className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              {editableLyrics.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                  <p className="text-sm text-white">Nenhum verso carregado</p>
                  <button
                    onClick={() => setActiveTab('paste')}
                    className="text-xs text-[#9575CD] hover:underline uppercase tracking-wider font-mono"
                  >
                    Clique aqui para colar o texto da letra
                  </button>
                </div>
              ) : (
                editableLyrics.map((line, idx) => {
                  const isCurrentTarget = idx === activeVerseIndex;
                  const isMarked = line.time > 0;

                  return (
                    <div
                      key={line.id}
                      ref={isCurrentTarget ? activeRowRef : null}
                      onClick={() => setActiveVerseIndex(idx)}
                      className={`flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer ${
                        isCurrentTarget
                          ? 'bg-[#9575CD]/20 text-white border border-[#9575CD]/40'
                          : 'bg-white/[0.015] hover:bg-white/[0.03] text-white/60'
                      }`}
                    >
                      <div className="flex items-center space-x-4 flex-1 min-w-0 pr-4">
                        <span className="text-xs font-mono text-white/30 w-6 tabular-nums">
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>
                        <p className={`text-sm truncate ${isCurrentTarget ? 'text-white font-medium' : 'text-white/70'}`}>
                          {line.text}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        <span className={`text-xs font-mono tabular-nums ${isMarked ? 'text-[#9575CD]' : 'text-white/20'}`}>
                          {isMarked ? formatTimecode(line.time) : '--:--'}
                        </span>
                        
                        {isCurrentTarget && (
                          <span className="text-[10px] uppercase font-mono tracking-wider bg-[#9575CD] text-white px-2 py-0.5 rounded-full">
                            Próximo
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Botão de Gravação Principal (O Toque do Produtor) */}
            <div className="pt-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs text-white/40">
                  Dica: Pressione <strong className="text-white/80 font-mono">Espaço</strong> ou <strong className="text-white/80 font-mono">Enter</strong> no instante exato da frase.
                </p>
                <div className="flex items-center space-x-3 pt-1">
                  <button
                    onClick={() => setActiveVerseIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeVerseIndex === 0}
                    className="text-xs font-mono text-white/40 hover:text-white disabled:opacity-20"
                  >
                    ← Voltar Verso
                  </button>
                  <span className="text-white/20">•</span>
                  <button
                    onClick={handleResetTimestamps}
                    className="text-xs font-mono text-rose-400/60 hover:text-rose-400"
                  >
                    Limpar Marcações
                  </button>
                </div>
              </div>

              <button
                onClick={handleMarkCurrentVerse}
                className="px-6 py-3 rounded-2xl bg-[#9575CD] hover:bg-[#8565bd] active:scale-95 text-white font-medium text-sm tracking-wide shadow-lg transition-all flex items-center space-x-2"
              >
                <span>Marcar Verso Atual</span>
                <span className="text-xs font-mono opacity-60">[Espaço]</span>
              </button>
            </div>
          </div>
        ) : (
          /* Aba de Colar Letra em Texto Puro */
          <div className="flex-1 flex flex-col min-h-0 py-6 space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-white font-medium">Cole a letra da música</p>
              <p className="text-xs text-white/40 font-light">
                Insira uma frase por linha. Cada linha será transformada em um verso para sincronização.
              </p>
            </div>

            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Cole os versos aqui...&#10;Exemplo:&#10;Quando o dia amanhece e a luz começa a brilhar&#10;Sentimos no coração a paz que veio pra ficar"
              className="flex-1 w-full p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-white text-sm font-sans placeholder-white/20 focus:outline-none focus:border-[#9575CD] resize-none"
            />

            <div className="flex justify-end">
              <button
                onClick={handleLoadRawText}
                disabled={rawText.trim().length === 0}
                className="px-5 py-2.5 rounded-xl bg-[#9575CD] hover:bg-[#8565bd] disabled:opacity-30 text-white text-xs font-mono tracking-wider transition-all"
              >
                Carregar Versos na Fila de Sincronia
              </button>
            </div>
          </div>
        )}

        {/* 3. Rodapé com Ações de Salvamento e Exportação */}
        <div className="pt-6 border-t border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopyJSON}
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-white/60 hover:text-white transition-colors"
            >
              {copiedFormat === 'JSON' ? '✓ JSON Copiado!' : 'Copiar JSON'}
            </button>

            <button
              onClick={handleCopyLRC}
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-white/60 hover:text-white transition-colors"
            >
              {copiedFormat === 'LRC' ? '✓ LRC Copiado!' : 'Copiar Formato LRC'}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-mono text-white/40 hover:text-white transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={handleApply}
              className="px-6 py-2 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-semibold tracking-wider transition-all"
            >
              Aplicar no Palco
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
