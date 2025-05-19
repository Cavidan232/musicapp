import React, { useState, useRef, useEffect } from "react";
import { 
  FaPlay, FaPause, FaStepBackward, FaStepForward, 
  FaVolumeUp, FaVolumeMute, FaDownload, FaStar, FaEllipsisV 
} from "react-icons/fa";
import { MdGraphicEq } from "react-icons/md";
import musicData from "./MusicData";
import "../css/music.css";

function Music() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [tracks, setTracks] = useState(musicData);
  
  const audioRef = useRef(new Audio());
  const progressInterval = useRef(null);

  // Zaman formatlama fonksiyonu eksikti
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Volume change handler eksikti
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    
    // Ses seviyesi 0 ise otomatik olarak mute yap
    if (newVolume === 0) {
      setIsMuted(true);
      audioRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      audioRef.current.muted = false;
    }
  };

  // Toggle mute fonksiyonu eksikti
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audioRef.current.muted = newMutedState;
  };

  // Load track durations
  useEffect(() => {
    if (tracks.length === 0) return;

    const updatedList = [...tracks];
    let loadedCount = 0;

    tracks.forEach((track, index) => {
      // Skip if duration is already calculated
      if (track.duration && track.duration !== "0:00") {
        loadedCount++;
        if (loadedCount === tracks.length) {
          setTracks(updatedList);
        }
        return;
      }

      const tempAudio = new Audio();
      
      tempAudio.onloadedmetadata = () => {
        const minutes = Math.floor(tempAudio.duration / 60);
        const seconds = Math.floor(tempAudio.duration % 60);
        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        updatedList[index] = { ...updatedList[index], duration: formattedDuration };
        loadedCount++;

        if (loadedCount === tracks.length) {
          setTracks(updatedList);
        }
      };

      tempAudio.onerror = () => {
        console.error(`Failed to load audio for track: ${track.title}`);
        updatedList[index] = { ...updatedList[index], duration: "0:00" };
        loadedCount++;
        if (loadedCount === tracks.length) {
          setTracks(updatedList);
        }
      };

      tempAudio.src = track.audio;
    });
  }, [tracks.length]);

  // Handle audio ended event to play next track - düzeltildi
  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;

    const handleTrackEnd = () => {
      playNext();
    };

    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('ended', handleTrackEnd);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentTrack, tracks]); // playNext fonksiyonunu useCallback ile sarmalamak daha iyi olur

  // playNext ve playPrevious fonksiyonları useCallback ile optimize edildi
  const playNext = React.useCallback(() => {
    if (!currentTrack || tracks.length === 0) return;

    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];

    setCurrentTrack(nextTrack);
    setCurrentPlayingId(nextTrack.id);
    audioRef.current.src = nextTrack.audio;
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;
    
    audioRef.current.play()
      .catch(error => console.error("Error playing next track:", error));
    
    // Reset progress bar
    setProgress(0);
    
    // Progress tracking başlat
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    progressInterval.current = setInterval(() => {
      if (audioRef.current.duration) {
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(currentProgress);
      }
    }, 1000);
  }, [currentTrack, tracks, volume, isMuted]);

  const playPrevious = React.useCallback(() => {
    if (!currentTrack || tracks.length === 0) return;

    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    const prevTrack = tracks[prevIndex];

    setCurrentTrack(prevTrack);
    setCurrentPlayingId(prevTrack.id);
    audioRef.current.src = prevTrack.audio;
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;
    
    audioRef.current.play()
      .catch(error => console.error("Error playing previous track:", error));
    
    // Reset progress bar
    setProgress(0);
    
    // Progress tracking başlat
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    progressInterval.current = setInterval(() => {
      if (audioRef.current.duration) {
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(currentProgress);
      }
    }, 1000);
  }, [currentTrack, tracks, volume, isMuted]);

  const togglePlay = (track) => {
    if (currentPlayingId === track.id) {
      // Pause current track
      audioRef.current.pause();
      setCurrentPlayingId(null);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else {
      // Check if we're toggling the same track that was previously paused
      const isResumingTrack = currentTrack && currentTrack.id === track.id;
      
      if (!isResumingTrack) {
        // Load new track
        setCurrentTrack(track);
        audioRef.current.src = track.audio;
      }
      
      // Set current playing state
      setCurrentPlayingId(track.id);
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      
      audioRef.current.play()
        .catch(error => console.error("Error playing track:", error));

      // Clear any existing interval
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      // Update progress bar
      progressInterval.current = setInterval(() => {
        if (audioRef.current.duration) {
          const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(currentProgress);
        }
      }, 1000);
    }
  };

  // Component unmount olduğunda interval'ı temizle
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  return (
    <div className="music-container">
      <div className="music-list">
        {tracks.map((track) => (
          <div key={track.id} className={`music-card ${currentPlayingId === track.id ? 'active' : ''}`}>
            <img src={track.cover} alt="Cover" className="cover" />

            <div className="info">
              <div className="title-line">
                <span className="title-music">{track.title}</span>
                {track.isNew && <span className="new-label">NEW</span>}
              </div>
              <p className="artist">{track.artist}</p>
              <p className="genre">{track.genre}</p>
            </div>

            <div className="actions">
              <button onClick={() => togglePlay(track)} className="play-button">
                {currentPlayingId === track.id ? <FaPause /> : <FaPlay />}
              </button>
              <span className="duration">{track.duration || "0:00"}</span>
              <FaDownload className="icon" />
              <FaStar className="icon" />
              <FaEllipsisV className="icon" />
            </div>
          </div>
        ))}
      </div>

      {/* Now playing bar */}
      {currentTrack && (
        <div className="now-playing">
          <div className="now-playing-left">
            <img src={currentTrack.cover} alt="Now Playing" className="now-playing-cover" />
            <div className="now-playing-info">
              <div className="now-playing-title">{currentTrack.title}</div>
              <div className="now-playing-artist">{currentTrack.artist}</div>
            </div>
          </div>

          <div className="now-playing-center">
            <div className="player-controls">
              <button
                onClick={playPrevious}
                className="control-button"
                disabled={!currentTrack}
              >
                <FaStepBackward />
              </button>

              <button
                onClick={() => togglePlay(currentTrack)}
                className="play-button"
                disabled={!currentTrack}
              >
                {currentPlayingId === currentTrack.id ? <FaPause /> : <FaPlay />}
              </button>

              <button
                onClick={playNext}
                className="control-button"
                disabled={!currentTrack}
              >
                <FaStepForward />
              </button>
            </div>
            <div className="progress-container">
              <div className="progress-time">
                {formatTime(audioRef.current?.currentTime || 0)}
              </div>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-time">{currentTrack.duration || "0:00"}</div>
            </div>
          </div>

          <div className="now-playing-right">
            <div className="volume-control">
              <button onClick={toggleMute} className="volume-button">
                {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
            <div className="visualizer">
              <MdGraphicEq className="visualizer-icon" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Music;