import { useEffect, useState } from "react";
import { ReactMic, ReactMicStopEvent } from "react-mic";
import { Container, Inputs, Waves } from "./styles";
import { Wave } from "./wave";

function App() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [secondsPassed, setSecondsPassed] = useState<number>(0);
  // Array de audios gravados
  const [audio, setAudio] = useState<ReactMicStopEvent[]>([]);
  // Array de audios Concatenados, transformando em um áudio
  const [concatAudio, setConcatAudio] = useState<Blob | null>(null);
  const [sendAudio, setSendAudio] = useState<ReactMicStopEvent[]>([]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const onStop = (recordedData: ReactMicStopEvent) => {
    setAudio((prev) => [...prev, recordedData]);
  };

  //Concatenar oa audios, caso haja pausa entre eles
  useEffect(() => {
    const audios = audio.map((a) => a.blob);
    const newConcatBlob = new Blob(audios, { type: "audio/ogg" });
    setConcatAudio(newConcatBlob);
  }, [audio]);

  const sendData = () => {
    if (concatAudio && audio.length > 1) {
      const blobURL = URL.createObjectURL(concatAudio);
      const blob: ReactMicStopEvent = {
        blob: concatAudio,
        blobURL: blobURL,
        option: { mimeType: "audio/ogg", audioBitsPerSecond: 128000 },
        startTime: secondsPassed,
        stopTime: 0,
      };
      setSendAudio((prev) => [...prev, blob]);
    } else {
      audio[0].startTime = secondsPassed;
      setSendAudio((prev) => [...prev, audio[0]]);
    }
    setAudio([]);
    setConcatAudio(null);
    setSecondsPassed(0);
  };

  // Verifica o tempo de gravação
  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = setInterval(() => {
        const totalDuration = Number(Math.floor(Number((secondsPassed + 1000 / 1000).toFixed(0))));
        setSecondsPassed(Math.abs(totalDuration));
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [secondsPassed, startRecording]);

  const minutesAmount = Math.floor(secondsPassed && secondsPassed >= 60 ? secondsPassed / 60 : 0);
  const secondsAmount = secondsPassed ? secondsPassed % 60 : 0;
  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  return (
    <Container>
      <Waves>
        {sendAudio.length !== 0 && sendAudio.map((a) => <Wave key={a.blobURL} audio={a} />)}
      </Waves>
      <Inputs>
        <span>{minutes[0]}</span>
        <span>{minutes[1]}</span>
        <p>:</p>
        <span>{seconds[0]}</span>
        <span>{seconds[1]}</span>

        <ReactMic
          record={isRecording}
          visualSetting="sinewave"
          onStop={onStop}
          strokeColor="#333"
          backgroundColor="aqua"
          mimeType="audio/webm"
          echoCancellation={true}
          autoGainControl={true}
          noiseSuppression={true}
        />

        {isRecording ? (
          <>
            <button onClick={stopRecording} type="button">
              Stop
            </button>
          </>
        ) : (
          <button onClick={startRecording} type="button">
            Start
          </button>
        )}
        {audio.length > 0 && (
          <button onClick={sendData} type="button">
            Enviar
          </button>
        )}
      </Inputs>
    </Container>
  );
}

export default App;
