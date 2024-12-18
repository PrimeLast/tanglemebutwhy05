import type { Context } from '@devvit/public-api';
import { Devvit, useState } from '@devvit/public-api';

import { GameService } from '../service/GameService.js';
import { PinnedPost } from './PinnedPost/PinnedPost.js';
import { ChallengePost } from './ChallengePost/ChallengePost.js';
import type { PostType } from '../types/GameState.js';

export const Router: Devvit.CustomPostComponent = (context: Context) => {
  const service = new GameService(context);
  const postId = context.postId;

  const [postType, setPostType] = useState<PostType | null>(null);

  // Fetch the post type dynamically
  service.getPostType(postId).then(setPostType);

  const postComponents = {
    Pinned: <PinnedPost service={service} />,
    challenge: <ChallengePost service={service} />,
  };

  return (
    <zstack width="100%" height="100%">
      {postType ? postComponents[postType] : <text>Loading...</text>}
    </zstack>
  );
};
