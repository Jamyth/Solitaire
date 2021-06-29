import Recoil from 'recoil';
import { injectLifeCycle } from 'coil-react';
import { Main } from './Main';
import type { State } from './type';
import type { Location } from 'history';
import { Solitaire } from 'util/Solitaire';

const initialState: State = {};

export let game: Solitaire | null = null;

export const GameState = Recoil.atom({
    key: 'GameState',
    default: initialState,
});

export const useGameAction = () => {
    const onMount = () => {
        if (!game) {
            game = new Solitaire();
        }
    };

    const onRouteMatched = (routeParameter: any, location: Location<Readonly<any> | undefined>) => {
        // TODO
    };

    return {
        onMount,
        onRouteMatched,
    };
};

export const MainComponent = injectLifeCycle<any, any>(Main, useGameAction);
