import Recoil from 'recoil'
import { GameV2State } from 'module/game-v2'
import type { State } from './type'

export const useGameV2State = <T>(fn: (state: State) => T): T => {
    const state = Recoil.useRecoilValue(GameV2State);
    return fn(state);
}