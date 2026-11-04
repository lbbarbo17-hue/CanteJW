export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number; // em segundos
  videoUrl?: string;
  thumbnailUrl?: string;
}

export interface LyricLine {
  id: string;
  time: number; // segundo exato em que a linha se torna ativa
  text: string;
}

export interface QueueItem {
  id: string;
  song: Song;
  requestedBy: string; // "Toque Social" (ex: "Letícia")
  requestedAt: string;
  status: 'playing' | 'up-next';
}

export interface RoomState {
  code: string;
  qrCodeUrl: string;
  currentSong: QueueItem | null;
  queue: QueueItem[];
}
