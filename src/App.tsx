//@ts-ignore
import { differenceInSeconds } from "date-fns/esm";
import { useCallback, useEffect, useState } from "react";
import { ReactMic, ReactMicStopEvent } from "react-mic";
import { Container, Inputs, Waves } from "./styles";
import { Wave } from "./wave";

function App() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recorderStartTime, setRecorderStartTime] = useState<Date>();
  const [secondsPassed, setSecondsPassed] = useState<number>();
  const [audio, setAudio] = useState<ReactMicStopEvent[]>([]);
  const [concatAudio, setConcatAudio] = useState<Blob | null>(null);
  const [sendAudio, setSendAudio] = useState<ReactMicStopEvent[]>([]);

  const startRecording = () => {
    setIsRecording(true);
    const date = new Date();
    setRecorderStartTime(date);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setSecondsPassed(0);
  };

  const onData = (recordedData: Blob) => {};

  const onStop = (recordedData: ReactMicStopEvent) => {
    setAudio((prev) => [...prev, recordedData]);
  };

  useEffect(() => {
    const audios = audio.map((a) => a.blob);
    const newConcatBlob = new Blob(audios, { type: "audio/webm" });
    setConcatAudio(newConcatBlob);
  }, [audio]);

  const sendData = () => {
    if (concatAudio) {
      const blobURL = URL.createObjectURL(concatAudio);
      const blob: ReactMicStopEvent = {
        blob: concatAudio,
        blobURL: blobURL,
        option: { mimeType: "audio/webm", audioBitsPerSecond: 128000 },
        startTime: audio[0].startTime,
        stopTime: audio[1].stopTime,
      };
      setSendAudio((prev) => [...prev, blob]);
      setAudio([]);
      setConcatAudio(null);
    }
  };
  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(recorderStartTime, new Date());
        setSecondsPassed(Math.abs(secondsDifference));
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
      <Waves>{sendAudio.length !== 0 && sendAudio.map((a) => <Wave key={"a"} audio={a} />)}</Waves>
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
          onData={onData}
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
        <button onClick={sendData} type="button">
          Enviar
        </button>
      </Inputs>
    </Container>
  );
}

export default App;
