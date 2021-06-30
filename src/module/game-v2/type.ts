export interface State {
    selectedCardIndex: number | null;
    selectedColumnIndex: number | null;
    selectedCardType: SelectedCardType | null;
}

export type SelectedCardType = 'deck' | 'column';
