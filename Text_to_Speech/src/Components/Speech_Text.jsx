import { useEffect, useState } from "react";
import "../Styles/TextToSpeech.css";

const Speech_Text = () => {
  const [textareaValue, setTextareaValue] = useState("");
  const [text, setText] = useState("Press the start button");
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      let recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onstart = function () {
        setText("Voice Recognition on");
        setIsListening(true);
      };
      recognition.onspeechend = function () {
        setText("No activity");
        setIsListening(false);
      };
      recognition.onerror = function () {
        setText("Try Again");
        setIsListening(false);
      };
      recognition.onresult = function (event) {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          var transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTextareaValue((prev) => prev + transcript);
          } else {
            interimTranscript += transcript;
          }
        }
        // setText(interimTranscript);
      };
      setRecognition(recognition);
    } else {
      setText("Speech Recognition API not supported in this browser.");
    }
  }, []);

  const startRecognition = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };
  const stopRecognition = () => {
    if (recognition && isListening) {
      recognition.stop();
      setText("Recognition stopped");
    }
  };

  return (
    <div>
      <div>
        <div className="hero">
          <h1>
            Speech to Text <span>Convertor</span>
          </h1>
          <textarea
            placeholder="Write something..."
            value={textareaValue}
            readOnly
          ></textarea>
          <div className="row">
            <button onClick={startRecognition} disabled={isListening}>
              Start
            </button>
            <button onClick={stopRecognition} disabled={!isListening}>
              Stop
            </button>
          </div>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Speech_Text;
