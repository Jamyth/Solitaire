import Recoil from 'recoil'
import { GameState } from 'module/game'
import type { State } from './type'

export const useGameState = <T>(fn: (state: State) => T): T => {
    const state = Recoil.useRecoilValue(GameState);
    return fn(state);
}