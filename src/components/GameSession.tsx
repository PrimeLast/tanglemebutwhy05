import { Devvit, useState } from '@devvit/public-api';
import { shuffleWords } from '../utils/shuffleWords.js';

export const GameSession = ({ service }: { service: any }) => {
  const [sentence, setSentence] = useState<string>('');
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  // Fetch a random sentence
  useState(() => {
    service.getRandomSentence().then((s: string) => {
      setSentence(s);
      setShuffledWords(shuffleWords(s.split(' ')));
    });
  });

  const onWordClick = (word: string) => {
    setSelectedWords((prev) => [...prev, word]);
  };

  const onClear = () => setSelectedWords([]);

  return (
    <vstack alignment="center middle" width="100%" height="100%">
      <text>Rearrange the words to form a sentence:</text>
      <hstack>
        {shuffledWords.map((word, i) => (
          <button key={i} onPress={() => onWordClick(word)} disabled={selectedWords.includes(word)}>
            {word}
          </button>
        ))}
      </hstack>
      <text>Selected: {selectedWords.join(' ')}</text>
      <button onPress={onClear}>Clear</button>
    </vstack>
  );
};
