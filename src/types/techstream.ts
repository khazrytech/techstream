// ==========================================
// TECHSTREAM OTT & IPTV GLOBAL TYPES SYSTEM
// ==========================================

// 1. Mfumo wa Watumiaji na Vifurushi (User & Subscriptions)
export type UserPlan = "FREE" | "STANDARD" | "PREMIUM";
export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  plan: UserPlan;
  role: UserRole;
  avatarUrl?: string;
  activeDevicesCount: number;
  maxAllowedDevices: number;
  createdAt: string;
}

// 2. Mfumo wa Channels & Auto-Failover Backups
export type StreamStatus = "ONLINE" | "SLOW" | "OFFLINE" | "CHECKING";
export type VideoQuality = "AUTO" | "360p" | "480p" | "720p" | "1080p" | "4K";

export interface IPTVChannel {
  id: string;
  name: string;
  logoUrl?: string;
  category: string;
  country: string;
  primaryStreamUrl: string; // M3U / HLS / DASH link kuu
  backupStreamUrls: string[]; // Backup 1, Backup 2, Backup 3
  activeStreamIndex: number; // Inafuatilia stream gani inatumika sasa
  quality: VideoQuality;
  isLive: boolean;
  isFeatured: boolean;
  status: StreamStatus;
  latencyMs?: number; // Ping/Speed ya stream
  epgChannelId?: string;
  userFavoritesCount?: number;
}

// 3. EPG (Electronic Program Guide) - Ratiba za Vipindi
export interface EPGProgram {
  id: string;
  channelId: string;
  title: string;
  description?: string;
  startTime: string; // ISO Date String
  endTime: string;
  category?: string;
  isCurrent: boolean;
}

// 4. Sports Center - Mechi na Matokeo ya Mubashara
export interface SportMatch {
  id: string;
  tournament: string; // Mfano: NBC Premier League, Champions League
  homeTeam: { name: string; logo: string; score?: number };
  awayTeam: { name: string; logo: string; score?: number };
  matchStatus: "UPCOMING" | "LIVE" | "FINISHED";
  startTime: string;
  associatedChannelId?: string; // Channel inayorusha mechi hii
  streamUrl?: string;
}

// 5. Movies & TV Series (VOD Hub)
export interface VODItem {
  id: string;
  title: string;
  type: "MOVIE" | "SERIES";
  posterUrl: string;
  backdropUrl?: string;
  description: string;
  releaseYear: number;
  rating?: string;
  genres: string[];
  streamUrl?: string; // Kwa Movies
  seasonsCount?: number; // Kwa Series
}

export interface Episode {
  id: string;
  seriesId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  streamUrl: string;
  durationMinutes?: number;
}

// 6. Player Diagnostics & Control System
export interface PlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentQuality: VideoQuality;
  currentPlaybackRate: number;
  isPictureInPicture: boolean;
  isDataSaverEnabled: boolean;
  bufferedPercentage: number;
  currentLatencyMs: number;
  hasError: boolean;
  errorMessage?: string;
}

// 7. Stream Report System (Taarifa za Matatizo)
export interface StreamProblemReport {
  id: string;
  channelId: string;
  userId: string;
  issueType: "NO_AUDIO" | "BLACK_SCREEN" | "BUFFERING" | "WRONG_EPG" | "OFFLINE";
  comment?: string;
  createdAt: string;
}
