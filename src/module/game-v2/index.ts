import Recoil from 'recoil';
import { injectLifeCycle, useCoilState, useHistory } from 'coil-react';
import { Main } from './Main'
import type { State } from './type';
import type { Location } from 'history'

const initialState: State = {}

export const GameV2State = Recoil.atom({
    key: "GameV2State",
    default: initialState
});

export const useGameV2Action = () => {
    const { getState, setState } = useCoilState(GameV2State);
    const history = useHistory<any>();

    const onMount = () => {
        // TODO
    }

    const onRouteMatched = (routeParameter: any, location: Location<Readonly<any> | undefined>) => {
        // TODO
    }

    return {
        onMount,
        onRouteMatched
    }
}

export const MainComponent = injectLifeCycle<any, any>(Main, useGameV2Action)