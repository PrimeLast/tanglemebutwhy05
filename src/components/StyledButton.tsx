import { Devvit } from '@devvit/public-api';


interface StyledButtonProps {
    label: string;
    appearance?: 'primary' | 'secondary'; // Or any other supported appearances
    onPress?: () => void;
    disabled?: boolean;

    // ... any other props your StyledButton component needs
}

export const StyledButton = (props: StyledButtonProps) => {
    return <button {...props}>{props.label}</button>;
};