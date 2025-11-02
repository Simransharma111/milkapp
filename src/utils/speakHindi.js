// src/utils/speakHindi.js

export function speakHindi(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("Speech synthesis not supported in this browser");
    return;
  }

  const speakNow = (voiceList) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 1;
    utterance.pitch = 1;

    const hindiVoice =
      voiceList.find((v) => v.lang.startsWith("hi") || v.name.includes("Google हिन्दी")) ||
      voiceList.find((v) => v.lang.startsWith("en-IN")) ||
      voiceList[0];

    if (hindiVoice) utterance.voice = hindiVoice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // 🟢 Handle Chrome async voice loading
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      const updated = window.speechSynthesis.getVoices();
      speakNow(updated);
    };
  } else {
    speakNow(voices);
  }
}
