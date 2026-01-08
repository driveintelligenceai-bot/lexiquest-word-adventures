// Text-to-Speech utility for dyslexia accessibility

export const speak = (text: string, rate: number = 0.85): void => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
};

export const speakLetter = (letter: string): void => {
  speak(letter, 0.7);
};

export const speakWord = (word: string): void => {
  speak(word, 0.8);
};

export const speakSentence = (sentence: string): void => {
  speak(sentence, 0.85);
};

export const speakCelebration = (word: string): void => {
  speak(`Correct! ${word}`, 0.9);
};
