export type ButtonType = 'Accept' | 'Cancel' | 'Neutral';

export interface InteractiveButton {
    buttonText: string;
    buttonType: ButtonType;
    onClick?: () => void;
}