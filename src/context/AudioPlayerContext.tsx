import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { ReleaseTrack } from "../data/releases";

export type AudioQueueItem = ReleaseTrack & {
  releaseTitle: string;
  chamberSlug: string;
  chamberRole: string;
};

type PlaybackState = "idle" | "loading" | "playing" | "paused" | "error" | "pending";

type AudioPlayerContextValue = {
  activeTrack?: AudioQueueItem;
  activeQueue: AudioQueueItem[];
  activeIndex: number;
  playbackState: PlaybackState;
  isUnlocked: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  errorMessage?: string;
  unlockAudio: () => void;
  playTrack: (track: AudioQueueItem, queue: AudioQueueItem[]) => Promise<void>;
  togglePlayback: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  clearError: () => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);

function getInitialUnlocked() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("cosmicsuprhero-audio-unlocked") === "true";
}

function clampVolume(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeTrack, setActiveTrack] = useState<AudioQueueItem | undefined>();
  const [activeQueue, setActiveQueue] = useState<AudioQueueItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [isUnlocked, setIsUnlocked] = useState(getInitialUnlocked);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeValue, setVolumeValue] = useState(0.72);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = volumeValue;
    audio.muted = isMuted;
    audioRef.current = audio;

    const handleLoadStart = () => setPlaybackState("loading");
    const handleLoadedMetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handlePlaying = () => setPlaybackState("playing");
    const handlePause = () => setPlaybackState((state) => (state === "error" || state === "pending" ? state : "paused"));
    const handleEnded = () => {
      setPlaybackState("paused");
      void playNextRef.current();
    };
    const handleError = () => {
      setPlaybackState("error");
      setErrorMessage("This audio file could not be loaded. Use the platform links while the archive file is repaired.");
    };

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audioRef.current = null;
    };
    // The audio element is intentionally created once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volumeValue;
  }, [volumeValue]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;
  }, [isMuted]);

  const unlockAudio = useCallback(() => {
    setIsUnlocked(true);
    window.localStorage.setItem("cosmicsuprhero-audio-unlocked", "true");
  }, []);

  const playTrack = useCallback(
    async (track: AudioQueueItem, queue: AudioQueueItem[]) => {
      setActiveTrack(track);
      setActiveQueue(queue);
      setActiveIndex(Math.max(0, queue.findIndex((item) => item.id === track.id)));
      setErrorMessage(undefined);

      if (!track.audioSrc) {
        setPlaybackState("pending");
        setCurrentTime(0);
        setDuration(0);
        return;
      }

      unlockAudio();
      const audio = audioRef.current;
      if (!audio) return;

      try {
        if (audio.src !== new URL(track.audioSrc, window.location.href).href) {
          audio.src = track.audioSrc;
          audio.load();
        }
        await audio.play();
      } catch {
        setPlaybackState("error");
        setErrorMessage("Playback was blocked by the browser. Press play again to open the transmission.");
      }
    },
    [unlockAudio],
  );

  const playTrackRef = useRef(playTrack);
  useEffect(() => {
    playTrackRef.current = playTrack;
  }, [playTrack]);

  const playNext = useCallback(async () => {
    if (!activeQueue.length) return;
    const nextIndex = activeIndex < 0 ? 0 : (activeIndex + 1) % activeQueue.length;
    await playTrackRef.current(activeQueue[nextIndex], activeQueue);
  }, [activeIndex, activeQueue]);

  const playPrevious = useCallback(async () => {
    if (!activeQueue.length) return;
    const previousIndex = activeIndex <= 0 ? activeQueue.length - 1 : activeIndex - 1;
    await playTrackRef.current(activeQueue[previousIndex], activeQueue);
  }, [activeIndex, activeQueue]);

  const playNextRef = useRef(playNext);
  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !activeTrack) return;

    if (!activeTrack.audioSrc) {
      setPlaybackState("pending");
      return;
    }

    unlockAudio();

    if (playbackState === "playing") {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      setPlaybackState("error");
      setErrorMessage("Playback was blocked by the browser. Press play again to open the transmission.");
    }
  }, [activeTrack, playbackState, unlockAudio]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(time)) return;
    audio.currentTime = Math.max(0, Math.min(time, audio.duration || 0));
    setCurrentTime(audio.currentTime);
  }, []);

  const setVolume = useCallback((nextVolume: number) => {
    setVolumeValue(clampVolume(nextVolume));
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((value) => !value);
  }, []);

  const clearError = useCallback(() => {
    setErrorMessage(undefined);
    setPlaybackState(activeTrack?.audioSrc ? "paused" : "pending");
  }, [activeTrack?.audioSrc]);

  const value = useMemo<AudioPlayerContextValue>(
    () => ({
      activeTrack,
      activeQueue,
      activeIndex,
      playbackState,
      isUnlocked,
      isMuted,
      volume: volumeValue,
      currentTime,
      duration,
      errorMessage,
      unlockAudio,
      playTrack,
      togglePlayback,
      playNext,
      playPrevious,
      seek,
      setVolume,
      toggleMute,
      clearError,
    }),
    [
      activeIndex,
      activeQueue,
      activeTrack,
      clearError,
      currentTime,
      duration,
      errorMessage,
      isMuted,
      isUnlocked,
      playNext,
      playPrevious,
      playTrack,
      playbackState,
      seek,
      setVolume,
      toggleMute,
      togglePlayback,
      unlockAudio,
      volumeValue,
    ],
  );

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
}

export function useAudioPlayerContext() {
  const value = useContext(AudioPlayerContext);
  if (!value) {
    throw new Error("useAudioPlayerContext must be used inside AudioPlayerProvider");
  }
  return value;
}
