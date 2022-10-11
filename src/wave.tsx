//@ts-nocheck
import { useEffect, useRef, useState } from "react";
import { ReactMicStopEvent } from "react-mic";
import WaveSurfer from "wavesurfer.js";
import { PlayButton, WaveformContianer, Wave as WaveDiv } from "./styles";
import { v4 as uuidv4 } from "uuid";

interface WaveProps {
  audio: ReactMicStopEvent;
}

export function Wave({ audio }: WaveProps) {
  const firstRender = useRef(true);
  const [waveSufer, setWaveSufer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const wavesurferId = `wavesurfer--${uuidv4()}`;

  function CreateWaveSurfer() {
    const wave = WaveSurfer.create({
      container: `#${wavesurferId}`,
      waveColor: "grey",
      progressColor: "tomato",
      height: 70,
      cursorWidth: 1,
      cursorColor: "lightgray",
      barWidth: 2,
      normalize: true,
      responsive: true,
      fillParent: true,
    });
    setWaveSufer(wave);
  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      CreateWaveSurfer();
    }
  }, []);

  useEffect(() => {
    if (waveSufer) {
      waveSufer.load(audio.blobURL);
    }
  }, [waveSufer]);

  const handlePlay = () => {
    setIsPlaying((prev) => !prev);
    waveSufer?.playPause();
  };

  const minutesAmount = Math.floor(audio.startTime >= 60 ? audio.startTime / 60 : 0);
  const secondsAmount = Math.floor(audio.startTime % 60);

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  return (
    <WaveformContianer>
      <PlayButton onClick={handlePlay}>{!isPlaying ? "Play" : "Pause"}</PlayButton>
      <WaveDiv id={wavesurferId} />
      <audio id={`track${wavesurferId}`} src={audio.blobURL} />
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <p>:</p>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </WaveformContianer>
  );
}
