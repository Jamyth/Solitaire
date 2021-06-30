import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useUpdatorState } from 'util/decorators/ForceRender';
import { solitaireV2 } from 'module/game-v2';
import { Deck } from './Deck';
import { House } from './House';
import { Bench } from './Bench';
import { useGameV2Action } from '../index';

export const Main = React.memo(() => {
    useUpdatorState();
    const { reset } = useGameV2Action();
    return (
        <Flex
            onClick={reset}
            color="white"
            h="100vh"
            maxH="100vh"
            overflowY="scroll"
            flexDirection="column"
            p={4}
            background="radial-gradient(circle at 50% 0,#016d29,#01431e 62%)"
        >
            {!solitaireV2 ? null : (
                <React.Fragment>
                    <Flex p={4} justifyContent="space-between">
                        <Deck />
                        <House />
                    </Flex>
                    <Bench />
                </React.Fragment>
            )}
        </Flex>
    );
});
