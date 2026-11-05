import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX, Sliders, Music2, Sparkles, Maximize2 } from 'lucide-react';
import { ProducerModal } from './ProducerModal';
import { QueueItem, LyricLine } from '../../types/stage';

// Dados de Exemplo Reais (Clipes Familiares / JW)
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

export default function ModoPalco() {
  const [currentTrack, setCurrentTrack] = useState<QueueItem | null>(SAMPLE_CURRENT_TRACK);
  const [queue, setQueue] = useState<QueueItem[]>(SAMPLE_QUEUE);
  const [lyrics, setLyrics] = useState<LyricLine[]>(SAMPLE_LYRICS);
  const [isProducerOpen, setIsProducerOpen] = useState<boolean>(false);

  // Estados de Reprodução de Áudio
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(18);
  const [duration, setDuration] = useState<number>(currentTrack?.song.duration || 222);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

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

  // Avança para a próxima música da fila
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

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'p' || e.key === 'P') {
        setIsProducerOpen((prev) => !prev);
      } else if (e.key === ' ' && !isProducerOpen) {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight' && e.shiftKey) {
        handleNextTrack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProducerOpen, handleNextTrack]);

  // Identifica o índice da linha ativa atual
  const activeIndex = lyrics.reduce((currIdx, line, idx) => {
    return currentTime >= line.time ? idx : currIdx;
  }, 0);

  const prevLine = activeIndex > 0 ? lyrics[activeIndex - 1] : null;
  const currentLine = lyrics[activeIndex] || null;
  const nextLine = activeIndex < lyrics.length - 1 ? lyrics[activeIndex + 1] : null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-screen h-screen bg-[#1A1A2E] text-white overflow-hidden flex flex-col justify-between p-10 font-sans selection:bg-[#4A148C]">
      {/* Luz ambiente de fundo sutil (Sem gradiente brega, apenas aura profunda) */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-[#4A148C]/15 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#9575CD]/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      {/* TOP BAR / CABEÇALHO */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4A148C] to-[#9575CD] flex items-center justify-center shadow-lg shadow-[#4A148C]/30">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-[0.25em] text-white">CANTE</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#9575CD] ml-1.5 mb-2 animate-pulse" />
          </div>
        </div>

        {/* Status da Música Atual (Discreto e elegante) */}
        <div className="hidden md:flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs uppercase tracking-wider text-white/50 font-medium">No Palco</span>
          </div>
          <span className="text-white/20">•</span>
          <span className="text-sm font-medium text-white/90">{currentTrack?.song.title}</span>
          <span className="text-white/20">•</span>
          <span className="text-xs text-[#9575CD] font-medium">Pedida por {currentTrack?.requestedBy}</span>
        </div>

        {/* Botão Modo Produtor */}
        <button 
          onClick={() => setIsProducerOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#9575CD]/40 text-white/80 hover:text-white transition-all duration-300 group shadow-sm"
        >
          <Sliders className="w-4 h-4 text-[#9575CD] group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-xs font-semibold tracking-wide uppercase">Modo Produtor</span>
          <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/50 font-mono">P</kbd>
        </button>
      </header>

      {/* CORPO PRINCIPAL (2 COLUNAS: PALCO + LATERAL) */}
      <main className="relative z-10 flex-1 grid grid-cols-12 gap-12 my-6 items-center min-h-0">
        {/* COLUNA ESQUERDA: PALCO TIPOGRÁFICO (TELEPROMPTER) */}
        <div className="col-span-8 flex flex-col justify-center items-start pl-8 space-y-8 min-h-0">
          
          {/* Linha Anterior */}
          <p className="text-2xl font-light text-white/25 tracking-wide transition-all duration-700 select-none">
            {prevLine ? prevLine.text : '...'}
          </p>

          {/* Linha Ativa (Foco Absoluto) */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#9575CD]/10 border border-[#9575CD]/20 text-[#9575CD] text-xs font-semibold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Verso Atual
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/90 leading-[1.15] drop-shadow-sm">
              {currentLine ? currentLine.text : '♪ Aguardando introdução...'}
            </h1>
          </div>

          {/* Próxima Linha */}
          <p className="text-2xl font-light text-white/35 tracking-wide transition-all duration-700 select-none">
            {nextLine ? nextLine.text : '...'}
          </p>
        </div>

        {/* COLUNA DIREITA: FILA + QR CODE INTEGRADO */}
        <aside className="col-span-4 h-full flex flex-col justify-between py-2 border-l border-white/5 pl-8 min-h-0">
          {/* Fila A Seguir */}
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-white/5 shrink-0">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/40">A Seguir</span>
              <span className="text-xs font-medium text-[#9575CD] bg-[#9575CD]/10 px-2 py-0.5 rounded-full">
                {queue.length} {queue.length === 1 ? 'música' : 'músicas'}
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {queue.map((item, index) => (
                <div 
                  key={item.id} 
                  className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/5 transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <span className="text-xs font-mono text-white/30 group-hover:text-[#9575CD] transition-colors shrink-0">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="truncate">
                      <p className="text-sm font-medium text-white/90 truncate group-hover:text-white transition-colors">
                        {item.song.title}
                      </p>
                      <p className="text-xs text-white/40 truncate font-light">
                        {item.song.artist}
                      </p>
                      <p className="text-[11px] text-white/30 mt-0.5 font-light">
                        Pedida por <span className="text-[#9575CD] font-medium">{item.requestedBy}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-white/30 tabular-nums shrink-0 pl-2">
                    {Math.floor(item.song.duration / 60)}:{(item.song.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code Integrado */}
          <div className="pt-6 border-t border-white/5 flex items-center gap-4 shrink-0">
            <div className="p-2.5 bg-white rounded-xl shadow-lg shrink-0">
              <svg
                className="w-16 h-16"
                viewBox="0 0 100 100"
                fill="black"
                aria-label={`QR Code para entrar na sala ${roomCode}`}
              >
                <rect x="10" y="10" width="28" height="28" fill="black" />
                <rect x="14" y="14" width="20" height="20" fill="white" />
                <rect x="18" y="18" width="12" height="12" fill="black" />
                <rect x="62" y="10" width="28" height="28" fill="black" />
                <rect x="66" y="14" width="20" height="20" fill="white" />
                <rect x="70" y="18" width="12" height="12" fill="black" />
                <rect x="10" y="62" width="28" height="28" fill="black" />
                <rect x="14" y="66" width="20" height="20" fill="white" />
                <rect x="18" y="70" width="12" height="12" fill="black" />
                <rect x="44" y="10" width="6" height="6" />
                <rect x="52" y="16" width="6" height="6" />
                <rect x="44" y="24" width="6" height="6" />
                <rect x="10" y="44" width="6" height="6" />
                <rect x="22" y="48" width="6" height="6" />
                <rect x="34" y="44" width="6" height="6" />
                <rect x="44" y="44" width="12" height="12" />
                <rect x="62" y="44" width="6" height="6" />
                <rect x="76" y="48" width="6" height="6" />
                <rect x="84" y="44" width="6" height="6" />
                <rect x="44" y="62" width="6" height="6" />
                <rect x="52" y="70" width="6" height="6" />
                <rect x="44" y="80" width="6" height="6" />
                <rect x="64" y="64" width="8" height="8" />
                <rect x="78" y="64" width="6" height="6" />
                <rect x="70" y="78" width="8" height="8" />
                <rect x="82" y="82" width="6" height="6" />
              </svg>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-white/90">Peça sua música</p>
              <p className="text-xs text-white/40 font-light">Aponte a câmera para entrar</p>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[10px] font-mono tracking-wider text-white/30 uppercase">Código:</span>
                <span className="text-xs font-mono font-bold tracking-widest text-[#9575CD]">{roomCode}</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* BOTTOM BAR / CONTROLES DE ÁUDIO */}
      <footer className="relative z-10 pt-4 border-t border-white/5 flex flex-col gap-3 shrink-0">
        {/* Scrubber / Barra de Progresso */}
        <div className="relative group/scrubber cursor-pointer">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden transition-all group-hover/scrubber:h-1.5">
            <div 
              className="h-full bg-gradient-to-r from-[#4A148C] to-[#9575CD] rounded-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <input 
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Controle de posição da música"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlay} 
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all border border-white/5"
              title={isPlaying ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button 
              onClick={handleNextTrack} 
              className="w-9 h-9 rounded-full bg-transparent hover:bg-white/5 text-white/40 hover:text-white flex items-center justify-center transition-colors"
              title="Pular faixa"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-white/40 tracking-wider tabular-nums pl-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className="text-white/40 hover:text-white transition-colors"
                title={isMuted ? 'Desativar Mudo' : 'Silenciar'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input 
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  setIsMuted(false);
                }}
                className="w-20 h-1 bg-white/15 rounded-full accent-[#9575CD] cursor-pointer"
                aria-label="Volume"
              />
            </div>

            <button 
              onClick={toggleFullscreen} 
              className="text-white/40 hover:text-white transition-colors"
              title="Tela Cheia (F)"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Modal do Modo Produtor */}
      <ProducerModal
        isOpen={isProducerOpen}
        onClose={() => setIsProducerOpen(false)}
        currentTrack={currentTrack}
        lyrics={lyrics}
        currentTime={currentTime}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onSeek={(time) => setCurrentTime(time)}
        onSaveLyrics={(newLyrics) => setLyrics(newLyrics)}
      />
    </div>
  );
}

export { ModoPalco as StageView };
