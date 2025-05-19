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
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioRef = useRef(new Audio());
  const progressInterval = useRef(null);

  // Zaman formatı
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Progress bar'a klik
  const handleProgressBarClick = (e) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressWidth = rect.width;
    const clickRatio = clickX / progressWidth;
    const newTime = clickRatio * audioRef.current.duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(clickRatio * 100);
  };

  // Download fonksiyonu
  const handleDownload = (track, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const a = document.createElement('a');
    a.href = track.audio;
    a.download = `${track.artist} - ${track.title}.mp3`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Volume kontrolu
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // Mute toggle
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) {
      audioRef.current.muted = newMuted;
    }
  };

  // Track duration hesabı
  useEffect(() => {
    const loadDurations = async () => {
      const updatedTracks = await Promise.all(
        tracks.map(async (track) => {
          if (track.duration && track.duration !== "0:00") {
            return track;
          }
          
          return new Promise((resolve) => {
            const audio = new Audio();
            audio.addEventListener('loadedmetadata', () => {
              const duration = formatTime(audio.duration);
              resolve({ ...track, duration });
            });
            audio.addEventListener('error', () => {
              resolve({ ...track, duration: "0:00" });
            });
            audio.src = track.audio;
          });
        })
      );
      
      setTracks(updatedTracks);
    };

    if (tracks.some(track => !track.duration || track.duration === "0:00")) {
      loadDurations();
    }
  }, [tracks]);

  // Progress update
  useEffect(() => {
    if (currentPlayingId && audioRef.current) {
      const updateProgress = () => {
        if (audioRef.current.duration) {
          const current = audioRef.current.currentTime;
          const duration = audioRef.current.duration;
          setCurrentTime(current);
          setProgress((current / duration) * 100);
        }
      };

      progressInterval.current = setInterval(updateProgress, 100);
      
      return () => {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      };
    }
  }, [currentPlayingId]);

  // Next track
  const playNext = () => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];
    
    setCurrentTrack(nextTrack);
    setCurrentPlayingId(nextTrack.id);
    audioRef.current.src = nextTrack.audio;
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;
    audioRef.current.play();
    setProgress(0);
    setCurrentTime(0);
  };

  // Previous track
  const playPrevious = () => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    const prevTrack = tracks[prevIndex];
    
    setCurrentTrack(prevTrack);
    setCurrentPlayingId(prevTrack.id);
    audioRef.current.src = prevTrack.audio;
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;
    audioRef.current.play();
    setProgress(0);
    setCurrentTime(0);
  };

  // Play/Pause toggle
  const togglePlay = (track) => {
    if (currentPlayingId === track.id) {
      // Pause
      audioRef.current.pause();
      setCurrentPlayingId(null);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else {
      // Play
      if (!currentTrack || currentTrack.id !== track.id) {
        // New track
        setCurrentTrack(track);
        audioRef.current.src = track.audio;
        setProgress(0);
        setCurrentTime(0);
      }
      
      setCurrentPlayingId(track.id);
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      audioRef.current.play();
    }
  };

  // Track bitdiyində
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => playNext();
    
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentTrack, tracks]);

  // Cleanup
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
              <span className="duration">{track.duration || "Loading..."}</span>
              <button 
                onClick={(e) => handleDownload(track, e)} 
                className="icon download-button"
                title="Download"
              >
                <FaDownload />
              </button>
              <FaStar className="icon" />
              <FaEllipsisV className="icon" />
            </div>
          </div>
        ))}
      </div>

      {/* Now Playing */}
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
              <button onClick={playPrevious} className="control-button">
                <FaStepBackward />
              </button>
              <button onClick={() => togglePlay(currentTrack)} className="play-button main-play">
                {currentPlayingId === currentTrack.id ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={playNext} className="control-button">
                <FaStepForward />
              </button>
            </div>
            
            <div className="progress-container">
              <div className="progress-time">
                {formatTime(currentTime)}
              </div>
              <div className="progress-bar" onClick={handleProgressBarClick}>
                <div className="progress" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="progress-time">
                {currentTrack.duration || "0:00"}
              </div>
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