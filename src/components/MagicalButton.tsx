import { Devvit, useState } from '@devvit/public-api';
export const MagicalButton = (props: any) => {
    return <button {...props}>{props.label}</button>;
};
