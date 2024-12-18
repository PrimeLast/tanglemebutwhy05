import { Devvit, useState } from '@devvit/public-api';

export const MagicalText = (props: any) => {
    return <text {...props}>{props.children}</text>;
};
