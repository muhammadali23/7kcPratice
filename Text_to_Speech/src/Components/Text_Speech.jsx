import { useEffect, useState } from "react";
import "../Styles/TextToSpeech.css";

const Text_Speech = () => {
  const [textareaValue, setTextareaValue] = useState("");
  const [optionValue, setOptionValue] = useState("");
  const [voices, setVoices] = useState([]);

  const speech = new SpeechSynthesisUtterance();

  useEffect(() => {
    const handleVoiceChangd = () => {
      const voices = window.speechSynthesis.getVoices();
      setVoices(voices);
      if (voices.length > 0) {
        setOptionValue(voices[0].name);
      }
    };
    window.speechSynthesis.onvoiceschanged = handleVoiceChangd;
    handleVoiceChangd();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const textToSpeech = () => {
    speech.text = textareaValue;
    const selectedVoice = voices.find((voice) => voice.name === optionValue);
    if (selectedVoice) {
      speech.voice = selectedVoice;
    }
    window.speechSynthesis.speak(speech);
  };
  return (
    <div>
      <div className="hero">
        <h1>
          Text to Speech <span>Convertor</span>
        </h1>
        <textarea
          placeholder="Write something...."
          value={textareaValue}
          onChange={(e) => {
            setTextareaValue(e.target.value);
          }}
        ></textarea>
        <div className="row">
          <select
            value={optionValue}
            onChange={(e) => setOptionValue(e.target.value)}
          >
            {voices.map((voice, index) => (
              <option key={index} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
          <button onClick={textToSpeech}>
            <img src="src\assets\play.png" alt="" /> Listen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Text_Speech;
