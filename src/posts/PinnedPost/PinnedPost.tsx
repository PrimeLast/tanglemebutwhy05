import { Context, Devvit, useAsync, useState } from '@devvit/public-api';
//import { GameSession } from '../../components/GameSession.js';
//import { Leaderboard } from '../../components/Leaderboard.js';
//import { LevelDisplay } from '../../components/LevelDisplay.js';
import { MagicalButton } from '../../components/MagicalButton.js';
import Settings from '../../settings.json' assert { type: 'json' };
//import type { UserProgress } from '../../types/UserProgress.js';





//import { Context, Devvit, useAsync, useState } from '@devvit/public-api';

import { UntanglePage } from '../../components/UntanglePage.js';   //>>>>need to define
import { HowToPlayPage } from '../../components/HowToPlayPage.js'; //>>>>need to define
//import { LeaderboardPage } from '../../components/LeaderboardPage.js';
//import { LevelPage } from '../../components/LevelPage.js';
import { LoadingState } from '../../components/LoadingState.js';
//import { MyDrawingsPage } from '../../components/MyDrawingsPage.js';
//import { PixelSymbol } from '../../components/PixelSymbol.js';
import { MagicalText } from '../../components/MagicalText.js';
//import { ProgressBar } from '../../components/ProgressBar.js';
//import { MagicalButton } from '../../components/MagicalButton.js';
import { Service } from '../../service/Service.js';
//import Settings from '../../settings.json' assert { type: "json" };
import type { GameSettings, PostData, UserData } from '../../types.js';
//import { getLevelByScore } from '../../utils.js';

interface PinnedPostProps {
  postData: PostData;
  userData: UserData | null;
  username: string | null;
  gameSettings: GameSettings;
 }

export const PinnedPost = (props: PinnedPostProps, context: Context): JSX.Element => {
  const service = new Service(context);
  const [page, setPage] = useState('menu');
  const buttonWidth = '256px';
  const buttonHeight = '48px';

  const { data: user, loading } = useAsync<{
    rank: number;
    score: number;
  }>(async () => {
    return await service.getUserScore(props.username);
  });

  if (user === null || loading) {
    return <LoadingState />;
  }

  

  const Menu = (
    <vstack width="100%" height="100%" alignment="center middle">
      <spacer grow />
      {/* Logo */}
      <image
        url="logo.png"
        imageHeight={128}
        imageWidth={128}
        width="64px"
        height="64px"
        description="TangleMeButWhy05 Logo"
      />
      <spacer height="16px" />

      {/* Wordmark */}
      <MagicalText scale={4}>TangleMeButWhy05</MagicalText>

      <spacer grow />

      {/* Menu */}
      <vstack alignment="center middle" gap="small">
        <MagicalButton
          width={buttonWidth}
          appearance="primary"
          height={buttonHeight}
          onPress={() => setPage('untangle')}
          leadingIcon="+"
          label="Untangle the Sentences (Let’s Play)"
        />
        <MagicalButton
          width={buttonWidth}
          appearance="secondary"
          height={buttonHeight}
          onPress={() => setPage('how-to-play')}
          label="HOW TO PLAY"
        />
      </vstack>
      <spacer grow />

           <spacer grow />
    </vstack>
  );

  const onClose = (): void => {
    setPage('menu');
  };
  const pages: Record<string, JSX.Element> = {
    menu: Menu,
    untangle: <UntanglePage {...props} onClose={onClose} />, //untangle: <UntanglePage {...props} onCancel={onClose} />,
   // 'my-drawings': <MyDrawingsPage {...props} onClose={onClose} onDraw={() => setPage('draw')} />,
    //leaderboard: <LeaderboardPage {...props} onClose={onClose} />,
    'how-to-play': <HowToPlayPage onClose={onClose} />,
    //level: (
      //<LevelPage {...props} user={user} percentage={percentage} level={level} onClose={onClose} />
   // ),
  };

  return pages[page] || Menu;


};
