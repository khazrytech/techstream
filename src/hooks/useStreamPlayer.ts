import { useState, useCallback } from "react";
import { IPTVChannel, PlayerState, VideoQuality } from "@/types/techstream";
import { switchToNextBackupStream, getActiveStreamUrl } from "@/lib/stream-health";

export function useStreamPlayer(initialChannel?: IPTVChannel) {
  const [channel, setChannel] = useState<IPTVChannel | undefined>(initialChannel);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    isMuted: false,
    volume: 1,
    currentQuality: "AUTO",
    currentPlaybackRate: 1,
    isPictureInPicture: false,
    isDataSaverEnabled: false,
    bufferedPercentage: 0,
    currentLatencyMs: 0,
    hasError: false,
  });

  const handleStreamError = useCallback(() => {
    if (!channel) return;
    
    // Jaribu kubadili kwenda stream inayofuata ya backup
    const updatedChannel = switchToNextBackupStream(channel);
    
    if (updatedChannel.activeStreamIndex === channel.activeStreamIndex) {
      // Kama hakuna backup iliyobaki, onyesha error
      setPlayerState((prev) => ({
        ...prev,
        hasError: true,
        errorMessage: "Channel hii haipatikani kwa sasa. Jaribu baadaye.",
      }));
    } else {
      setChannel(updatedChannel);
      setPlayerState((prev) => ({
        ...prev,
        hasError: false,
        errorMessage: undefined,
      }));
    }
  }, [channel]);

  const changeQuality = (quality: VideoQuality) => {
    setPlayerState((prev) => ({ ...prev, currentQuality: quality }));
  };

  const togglePlay = () => {
    setPlayerState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  return {
    channel,
    setChannel,
    currentStreamUrl: channel ? getActiveStreamUrl(channel) : "",
    playerState,
    setPlayerState,
    handleStreamError,
    changeQuality,
    togglePlay,
  };
}
