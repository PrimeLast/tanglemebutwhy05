import { Devvit } from '@devvit/public-api';
import { Router } from './posts/router.js';
//import { PinnedPost } from './posts/PinnedPost/PinnedPost.js';
//import { newPinnedPost } from './actions/newPinnedPost.js';
import { installGame } from './actions/installGame.js';
Devvit.configure({
  redditAPI: true,
  redis: true,
  media: true,
});


Devvit.addCustomPostType({
  name: 'tanglemebutwhy05___This is WIP',
  height: 'tall',
  render: Router,
});

//Devvit.addMenuItem(PinnedPost); // Create pinned community challenge post
//Devvit.addMenuItem(newPinnedPost);
Devvit.addMenuItem(installGame);
export default Devvit;
