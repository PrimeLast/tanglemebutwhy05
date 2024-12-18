import { Devvit, useState } from '@devvit/public-api';
import sentences from '../data/sentences.json';
import { StyledButton } from './StyledButton.js';
import { MagicalText } from './MagicalText.js';
import Settings from '../settings.json';

// Shuffle the words in the sentence
function shuffleArray(array: string[]): string[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Get three random sentences from the category
const getRandomSentences = (category: string): string[] => {
    const filteredSentences = sentences.sentences.filter((s) => s.category === category).map((s) => s.text);
    if (!filteredSentences.length) return ["No sentences available in this category."];
    
    const selectedSentences = [];
    while (selectedSentences.length < 3 && filteredSentences.length) {
        const randomIndex = Math.floor(Math.random() * filteredSentences.length);
        selectedSentences.push(filteredSentences[randomIndex]);
        filteredSentences.splice(randomIndex, 1);  // Remove selected sentence
    }
    return selectedSentences;
};

// Chunk words into rows (e.g., 5 words per row)
const chunkArray = (array: string[], size: number): string[][] => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

export function UntanglePage(props: { onClose: () => void }) {
    const [category, setCategory] = useState<string>("General");
    const [gameState, setGameState] = useState({
        sentences: [] as string[],  // Array of sentences
        shuffledWords: [] as string[],  // Shuffled words
        selectedWords: [] as string[],  // Words selected by the user
        guessedSentences: [] as string[],  // List of guessed sentences
        gameOver: false,
        isWon: false,
        disabledWords: [] as string[],  // Words that are disabled (selected)
    });

    const initializeGame = () => {
        const sentences = getRandomSentences(category);
        const shuffledWords = sentences.flatMap(sentence => shuffleArray(sentence.split(' ')));
        setGameState({
            sentences,
            shuffledWords,
            selectedWords: [],
            guessedSentences: [],
            gameOver: false,
            isWon: false,
            disabledWords: [],  // Reset disabled words when the game is initialized
        });
    };

    // Initialize game when the category is changed
    const changeCategory = (newCategory: string) => {
        setCategory(newCategory);
        initializeGame();
    };

    // Select word logic
    const selectWord = (word: string) => {
        if (gameState.gameOver || gameState.disabledWords.includes(word)) return;

        setGameState((prevState) => {
            const newSelectedWords = [...prevState.selectedWords, word];
            const newDisabledWords = [...prevState.disabledWords, word];  // Disable selected word
            const currentSentence = newSelectedWords.join(' ');  // Check if selected sentence is correct
            const isWon = gameState.sentences.some((sentence) => currentSentence === sentence);

            if (isWon || newSelectedWords.length === prevState.shuffledWords.length) {
                Devvit.ui.showToast(isWon ? "You won!" : "Incorrect! Try again.");
            }

            return {
                ...prevState,
                selectedWords: newSelectedWords,
                disabledWords: newDisabledWords,  // Update disabled words
                isWon,
                gameOver: isWon || newSelectedWords.length === prevState.shuffledWords.length,
            };
        });
    };

    // Clear the selected words
    const clearSelection = () => setGameState((prev) => ({ ...prev, selectedWords: [], disabledWords: [] }));

    // Add the currently formed sentence to the guessed sentences list
    const addGuessedSentence = () => {
        const currentSentence = gameState.selectedWords.join(' ');
        if (currentSentence.trim()) {
            setGameState((prevState) => ({
                ...prevState,
                guessedSentences: [...prevState.guessedSentences, currentSentence],
                selectedWords: [],  // Reset the selected words after adding the sentence
            }));
        }
    };

    // Submit all guessed sentences and evaluate
    const submitGuessedSentences = () => {
        const correctSentences = gameState.sentences;
        const correctGuesses = gameState.guessedSentences.filter(guessedSentence =>
            correctSentences.includes(guessedSentence)
        );
        Devvit.ui.showToast(`You guessed ${correctGuesses.length} out of ${gameState.guessedSentences.length} sentences correctly!`);
    };

    return (
      <vstack gap="medium" alignment="center middle" height="100%" width="100%" grow>
        {/* Header */}
        <hstack grow width="100%" alignment="center middle">
            <spacer width="24px" />
            <text size="large" weight="bold">Untangle the Sentence!</text>
            <spacer grow />
            <StyledButton
                appearance="primary"
                label="x"
                onPress={props.onClose}
            />
            <spacer width="20px" />
        </hstack>

        {/* Category Selector */}
        <hstack gap="small">
            {["General", "Movies", "Proverbs"].map((cat) => (
                <StyledButton
                    key={cat}
                    label={cat}
                    appearance={cat === category ? "primary" : "secondary"}
                    onPress={() => changeCategory(cat)}
                />
            ))}
        </hstack>

        {/* Display Shuffled Words */}
        {gameState.shuffledWords.length > 0 ? (
            <vstack gap="small" alignment="center middle" width="100%" height="50%">
                {chunkArray(gameState.shuffledWords, 9).map((chunk, chunkIndex) => (
                    <hstack key={chunkIndex} gap="small" alignment="center middle" width="100%">
                        {chunk.map((word, index) => (
                            <StyledButton
                                key={index}
                                label={word}
                                appearance="secondary"
                                onPress={() => selectWord(word)}
                                disabled={gameState.gameOver || gameState.disabledWords.includes(word)}  
                            />
                        ))}
                    </hstack>
                ))}
            </vstack>
        ) : (
            <text>Choose a Category to</text>
        )}

        {/* Display selected words */}
        <vstack gap="small" alignment="center middle" padding="medium">
            <MagicalText scale={2} color={Settings?.theme?.primary}>
                {gameState.selectedWords.join(' ')}
            </MagicalText>
        </vstack>

        {/* Guessed Sentences */}
        <vstack gap="small" alignment="center middle">
            <text size="medium">Your Guessed Sentences:</text>
            {gameState.guessedSentences.map((sentence, index) => (
                <MagicalText key={index} scale={1.5} color={Settings?.theme?.primary}>
                    {sentence}
                </MagicalText>
            ))}
        </vstack>

        {/* Clear, Add and Submit Buttons */}
        <vstack gap="small" alignment="center middle">
            {!gameState.gameOver && (
                <hstack gap="small">
                    <StyledButton label="Clear" appearance="secondary" onPress={clearSelection} />
                    <StyledButton label="Add Sentence" appearance="primary" onPress={addGuessedSentence} />
                    <StyledButton label="Submit All" appearance="primary" onPress={submitGuessedSentences} />
                </hstack>
            )}
        </vstack>

        {/* Game Over State */}
        {gameState.gameOver && (
            <vstack gap="medium" alignment="center middle">
                <MagicalText scale={2} color={gameState.isWon ? Settings?.theme?.primary : "red"}>
                    {gameState.isWon ? "You won!" : "Try Again!"}
                </MagicalText>
                <StyledButton label="Play Again" onPress={initializeGame} />
            </vstack>
        )}
      </vstack>
    );
}
