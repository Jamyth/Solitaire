import type React from 'react';
import { async } from 'coil-react';

export type Route = '/lobby' | '/game';

export interface RouteConfig {
    component: React.ComponentType<any>;
}

export const NavigationService: Record<Route, RouteConfig> = {
    '/lobby': {
        component: async(() => import('module/lobby'), 'MainComponent'),
    },
    '/game': {
        component: async(() => import('module/game-v2'), 'MainComponent'),
    },
};
