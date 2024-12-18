import { FlairTextColor } from '@devvit/public-api';


export type CommentId = `t1_${string}`;
export type UserId = `t2_${string}`;
export type PostId = `t3_${string}`;
export type SubredditId = `t5_${string}`;

export type PostData = {
    postId: PostId;
    postType: string;
  };

  export type PinnedPostData = {
    postId: PostId;
    postType: string;
  };

  export type PostGuesses = {
    guesses: { [guess: string]: number };
    wordCount: number;
    guessCount: number;
    playerCount?: number;
  };

  export type WordSelectionEvent = {
    userId: UserId;
    postId: PostId;
    options: { word: string; sentenceCategoryName: string }[];
    word?: string;
    type: 'refresh' | 'manual' | 'auto';
  };
 
  export enum PostType {
   // DRAWING = 'drawing',
   // COLLECTION = 'collection',
    PINNED = 'pinned',
   // PinnedPost='Pinnedpost'
  }
  
  export type GameSettings = {
    subredditName: string;
   // selectedDictionary: string;
  };

  export type UserData = {
    score: number;
    solved: boolean; // Has the user solved this post?
    skipped: boolean; // Has the user skipped this post?
    levelRank: number;
    levelName: string;
    guessCount: number;
  };