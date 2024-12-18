## **Objective**
Game Name: TangleMeButWhy
Create a Reddit-based asynchronous word game where players rearrange scrambled words to form a meaningful sentence. After reordering words, users will also see a humorous 'Reason' through 'ButWhy' button. Users shall be able to Post their sentence scramble for other players to attempt and comment their own 'Reason' and most upvoted comment will be displayed on the Leaderboard. 

---

## **Core Features**
Create a Reddit word game where players reorder scrambled words into sentences, view funny 'Reasons' via a 'ButWhy' button, post challenges, and vote on the best 'Reason' for a leaderboard.
### 1. **Core Interaction**

- **Goal**: Rearrange scrambled words to match the original sentence.
- **Overview**: 
   - Players engage with scrambled sentences by selecting words in the correct order.
   - Additional features like sentence categories, partial scoring, and humor integration enhance the experience.
- **Post Types**: Refer to the **Post Types** section for detailed gameplay and interaction flows.

### 2. **Sentence Source**

- **Dynamic Source Expansion**
  - **Local Storage**: Use a `sentences.json` file for initial sentence storage and quick prototyping. The file will include a categorized structure, making it easy to retrieve sentences by themes like "Movies," "Proverbs," or "General."
  - **Remote Storage**: Leverage Reddit's Redis service for scalable storage and retrieval. This will ensure the game can support a growing number of sentences and track user-submitted content efficiently.
  - **Google Gemini Integration**: Utilize Google Gemini LLM to generate or validate sentences dynamically, allowing for high-quality, contextually relevant, and grammatically accurate sentences.

- **Categorized Structure**
  - Sentences will be grouped into categories to allow players to select themes:
    - **General Sentences**: Everyday phrases and sayings.
    - **Thematic Categories**: Popular lines from movies, proverbs, or user-submitted themes.
  - Each sentence will include metadata:
    - `id`: A unique identifier.
    - `category`: The category it belongs to.
    - `source`: Whether it’s user-generated, API-fetched, or preloaded.
    - `addedBy`: (Optional) Username of the contributor for user-submitted content.

- **Sentence Validation**
  - Ensure the integrity and appropriateness of sentences:
    - Validate grammar and coherence using the LLM.
    - Filter out duplicate or overly complex sentences.
    - Allow moderation of user-submitted content before it is added to the database.

- **Scalability and Moderation**
  - Community contributions:
    - Users can suggest sentences, which moderators or automation tools review for quality.
  - Scheduled updates:
    - Add new sentences weekly or daily from external APIs or curated lists.
  - Dynamic expansion:
    - Pull fresh sentences from Google Gemini or other APIs to keep content engaging and relevant.

### 3. **Randomization**

- Words in the sentence are shuffled using a randomization algorithm to ensure variety.
- Players can choose a category (e.g., "General" or "Movies") before starting.
- Each game session starts with a new random sentence from the selected category.

### 4. **Post Types**

#### Type 1: Community Game Post
- Created by the game installation in a community.
- Accessible to all visitors of the subreddit.
- Menu options:
  1. **Untangle the Sentences (Let’s Play)**: Starts a game session.
      - Shows scrambled words from 5 sentences.
      - Users must correctly reorder at least 3 sentences to win.
      - Partial points awarded for grammatically correct but incorrect guesses.
  2. **Leaderboard**: Displays top players and their scores.
  3. **My Challenges**: Shows the user’s submitted or active challenges.
  4. **User Level**: Displays the user’s overall progress and achievements.

#### Type 2: User-Generated Challenge Post
- Created by users after completing a game session.
- Contains the scrambled sentences they played, allowing others to attempt them.
- Includes the user’s score and leaderboard for the specific challenge.

### 5. **Recognition and Scoring**

- **Overall Score**: Tracks total sentences solved by the user (stored in Redis for long-term retention).
- **Category Score**: Separate scores for each category (e.g., "Movies" or "Proverbs").
- **Levels**:
  - Users progress through levels based on their overall score.
  - Level badges displayed in the subreddit.

### 6. **Funny "But Why" Feature**

- When players complete a sentence, they can press a "But Why?" button to see a humorous, made-up reason related to the sentence.
- Example:
  - Original sentence: "This is a test sentence."
  - Output: "This is a test sentence, but why? Because aliens are evaluating our grammar!"
- Players can submit their own "But Why?" answers in comments.
- Weekly leaderboard for the most upvoted "But Why?" comments to increase engagement, with a moderation mechanism to prevent abuse or spam.

---

## **Design Principles**

### 1. **Bite-Sized Gameplay**

- Quick to play (under 2 minutes per round).
- Simple rules and intuitive interface.

### 2. **Asynchronous Play**

- Players can participate anytime without requiring others.
- Works seamlessly across different time zones.

### 3. **Scalability**

- Single-player experience by default.
- Potential for community challenges or leaderboards to foster competition.

### 4. **Social Interaction**

- Shareable results: Players can share their completed sentences or scores in the subreddit.
- Community challenges: Users submit their own sentences for others to play.

---

## **Technical Implementation**

### 1. **Game Logic**

- **State Management**:
  - Store the original sentence, shuffled words, selected words, and game state (e.g., "gameOver", "isWon").
- **Shuffling Algorithm**:
  - Use the Fisher-Yates shuffle to randomize words.
- **Validation**:
  - Check if the player’s selected words match the original sentence.

### 2. **User Interface**

- **Word Buttons**:
  - Display shuffled words as clickable buttons.
  - Disable buttons for completed words or when the game is over.
- **Selected Words Display**:
  - Show the player’s current progress (selected words in order).
- **Feedback Messages**:
  - Use toast notifications for success or failure.
- **Replay Options**:
  - "Play Again" button for a new game.
  - "Clear" button to reset selections.

### 4. **"But Why" Integration**

- Display a humorous explanation for the completed sentence.
- Fetch pre-written reasons from a JSON file or allow dynamic generation.
- Enable users to comment their own reasons and track the most upvoted.

### 5. **Devvit Integration**

- **Custom Post Type**:
  - Render the game directly within a Reddit post.
- **Redis Storage**:
  - Store scores, progress, and leaderboards.
- **Scheduled Content**:
  - Automate weekly leaderboards and challenges.

---

## **Expansion Ideas**

### 1. **Daily Challenges**

- Post a new sentence daily in the subreddit for players to solve.
- Leaderboard tracking for daily high scores.

### 2. **User-Generated Content**

- Allow users to submit their own sentences as challenges.
- Use moderation tools to ensure quality.

### 3. **Multiplayer Features**

- Add a competitive mode where players solve the same sentence and compare times.

### 4. **Thematic Sentences**

- Group sentences by themes (e.g., quotes, proverbs, movie lines).
- Let players choose a theme before starting.

### 5. **Prioritized Expansion**

- Implement new features in phases:
  1. **Daily Challenges**: Start with a single daily challenge post to build engagement.
  2. **User-Generated Content**: Enable user submissions after the core mechanics are well-received.
  3. **Thematic Sentences**: Gradually introduce themes based on user preferences and feedback.
  4. **Multiplayer Features**: Add competitive gameplay as the community grows.
