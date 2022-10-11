import styled from "styled-components";
import { style } from "wavesurfer.js/src/util";

export const WaveformContianer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
  background: #f5f5f5;
  gap: 2rem;
`;

export const Wave = styled.div`
  width: 90%;
  height: 90px;
  overflow: hidden;

  wave {
    overflow: hidden !important;
  }
`;

export const PlayButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  background: #aaa;
  border-radius: 50%;
  border: none;
  outline: none;
  cursor: pointer;
  padding-bottom: 3px;
  &:hover {
    background: #ddd;
  }
`;

export const Container = styled.div`
  width: 100%;
  height: calc(100vh - 20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const Waves = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`;

export const Inputs = styled.div`
  width: 100%;
  height: 12%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;

  background-color: aqua;

  button {
    cursor: pointer;
    width: 60px;
    height: 35px;
    border-radius: 14px;
    border: none;
    outline: none;
    background-color: #aaa;
    color: #292929;
  }
`;
