import Recoil from 'recoil';
import { injectLifeCycle, useCoilState } from 'coil-react';
import { Main } from './Main';
import type { State } from './type';
import { SolitaireV2 } from 'util/SolitaireV2';

const initialState: State = {
    selectedCardIndex: null,
    selectedColumnIndex: null,
    selectedCardType: null,
};

export let solitaireV2: SolitaireV2 | null = null;

export const newGame = () => {
    solitaireV2 = new SolitaireV2('medium');
};

export const GameV2State = Recoil.atom({
    key: 'GameV2State',
    default: initialState,
});

export const useGameV2Action = () => {
    const { setState } = useCoilState(GameV2State);

    const onMount = () => {
        if (!solitaireV2) {
            newGame();
        }
    };

    const selectDeckCard = (index: number) => {
        setState((state) => {
            state.selectedCardType = 'deck';
            state.selectedCardIndex = index;
            state.selectedColumnIndex = null;
        });
    };

    const selectColumnCard = (cardIndex: number, columnIndex: number) => {
        setState((state) => {
            state.selectedCardType = 'column';
            state.selectedCardIndex = cardIndex;
            state.selectedColumnIndex = columnIndex;
        });
    };

    const reset = () => {
        setState(initialState);
    };

    return {
        onMount,
        selectDeckCard,
        selectColumnCard,
        reset,
    };
};

export const MainComponent = injectLifeCycle<any, any>(Main, useGameV2Action);
