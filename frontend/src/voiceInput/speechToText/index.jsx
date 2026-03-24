import React, { useEffect, useRef, useState } from 'react'

function useSpeechToText(options) {
    const [isListening,setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitiionRef = useRef(null)

    useEffect(()=>{
        if(!('webkitSpeechRecognition' in window)){
            console.error("Web Speech api is not supported.");
            return;
        }

        recognitiionRef.current = new window.webkitSpeechRecognition()
        const recognition = recognitiionRef.current;
        recognition.interimResults = options.interimResults || true;
        recognition.lang = options.lang || "en-US";
        recognition.continuous = options.continuous || false

        if("webkitSpeechGrammarList" in window ){
            const grammar = "#JSFG V1.0; grammar punctuation; public <punc> = . | , | ? | ! | ; | : ;"
            const speechRecognitionList = new window.webkitSpeechGrammarList()
            speechRecognitionList.addFromString(grammar,1)
            recognition.grammars = speechRecognitionList
        }

        
    },[])

  return (
    <div>
      
    </div>
  )
}

export default useSpeechToText
