import { set } from 'component/RecoilLoader';
import Recoil from 'recoil';

const UpdatorState = Recoil.atom({
    key: 'UpdatorState',
    default: 0,
});

export const useUpdatorState = () => Recoil.useRecoilValue(UpdatorState);

export function ForceRender() {
    return (target: object, key: string | symbol, descriptor?: PropertyDescriptor) => {
        const originFn = descriptor?.value;

        if (descriptor) {
            descriptor.value = function (...args: any[]) {
                try {
                    originFn.bind(this, ...args)();
                } finally {
                    set(UpdatorState, (state) => state + 1);
                }
            };
        }
    };
}
