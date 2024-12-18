
import type {
  Post, 
  RedditAPIClient,
  RedisClient,
  Scheduler,
  ZRangeOptions,
} from '@devvit/public-api';

//import { Devvit } from '@devvit/public-api';
import Settings from '../settings.json';
import type {
      CommentId,
      GameSettings,
      PinnedPostData,
      PostGuesses,
      PostId,
      PostType,
      UserData,
      WordSelectionEvent,
 } from '../types.js';
 
 import { getLevelByScore } from '../utils/utils.js';
 
 export class Service {
  readonly redis: RedisClient;
  readonly reddit?: RedditAPIClient;
  readonly scheduler?: Scheduler;
  constructor(context: { redis: RedisClient; reddit?: RedditAPIClient; scheduler?: Scheduler }) {
    this.redis = context.redis;
    this.reddit = context.reddit;
    this.scheduler = context.scheduler;
  }

readonly tags = {
  scores: 'default',
};
readonly keys = {
  dictionary: (dictionaryName: string) => `dictionary:${dictionaryName}`,
  dictionaries: 'dictionaries',
  gameSettings: 'game-settings',
  guessComments: (postId: PostId) => `guess-comments:${postId}`,
  postData: (postId: PostId) => `post:${postId}`,
  postGuesses: (postId: PostId) => `guesses:${postId}`,
  postSkipped: (postId: PostId) => `skipped:${postId}`,
  postSolved: (postId: PostId) => `solved:${postId}`,
  postUserGuessCounter: (postId: PostId) => `user-guess-counter:${postId}`,
  scores: `pixels:${this.tags.scores}`,
  userData: (username: string) => `users:${username}`,
  userDrawings: (username: string) => `user-drawings:${username}`,
  wordDrawings: (word: string) => `word-drawings:${word}`,
  wordSelectionEvents: 'word-selection-events',
};
  /*
   * Pinned Post
   */

  async savePinnedPost(postId: PostId): Promise<void> {
    const key = this.keys.postData(postId);
    await this.redis.hSet(key, {
      postId,
      postType: 'Pinned',
    });
  }

  async getPinnedPost(postId: PostId): Promise<PinnedPostData> {
    const key = this.keys.postData(postId);
    const postType = await this.redis.hGet(key, 'postType');
    return {
      postId,
      postType: postType ?? 'pinned',
    };
  }

 /*
   * Game settings
   */

 async storeGameSettings(settings: { [field: string]: string }): Promise<void> {
  const key = this.keys.gameSettings;
  await this.redis.hSet(key, settings);
}

async getGameSettings(): Promise<GameSettings> {
  const key = this.keys.gameSettings;
  return (await this.redis.hGetAll(key)) as GameSettings;
}


async getUserScore(username: string | null): Promise<{
  rank: number;
  score: number;
}> {
  const defaultValue = { rank: -1, score: 0 };
  if (!username) return defaultValue;
  try {
    const [rank, score] = await Promise.all([
      this.redis.zRank(this.keys.scores, username),
      // TODO: Remove .zScore when .zRank supports the WITHSCORE option
      this.redis.zScore(this.keys.scores, username),
    ]);
    return {
      rank: rank === undefined ? -1 : rank,
      score: score === undefined ? 0 : score,
    };
  } catch (error) {
    if (error) {
      console.error('Error fetching user score board entry', error);
    }
    return defaultValue;
  }
}

async getUser(username: string | null, postId: PostId): Promise<UserData | null> {
  if (!username) return null;
  const data = await this.redis.hGetAll(this.keys.userData(username));
  const solved = !!(await this.redis.zScore(this.keys.postSolved(postId), username));
  const skipped = !!(await this.redis.zScore(this.keys.postSkipped(postId), username));
  const guessCount =
    (await this.redis.zScore(this.keys.postUserGuessCounter(postId), username)) ?? 0;

  const user = await this.getUserScore(username);
  const level = getLevelByScore(user.score);
  const parsedData: UserData = {
    score: user.score,
  levelRank: data.levelRank ? parseInt(data.levelRank) : level.rank,
  levelName: data.levelName ?? level.name,
    solved,
    skipped,
    guessCount,
  };
  return parsedData; 
} 

async getPostType(postId: PostId) {
  const key = this.keys.postData(postId);
  const postType = await this.redis.hGet(key, 'postType');
  const defaultPostType = 'drawing';
  return (postType ?? defaultPostType) as PostType;
}


}



