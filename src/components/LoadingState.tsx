import { Devvit } from '@devvit/public-api';

export const LoadingState = (): JSX.Element => (
  <zstack width="100%" height="100%" alignment="center middle">
     <text size="large">Loading...</text>
    <image
      imageHeight={1024}
      imageWidth={1500}
      height="100%"
      width="100%"
      url="background.png"
      description="Tangle Me Background"
      resizeMode="cover"
    />
     </zstack>
);
