import React from 'react';
import { useUpdatorState } from 'util/decorators/ForceRender';
import type { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import { Flex } from '@chakra-ui/react';
import { Deck } from './Deck';
import { House } from './House';
import { Bench } from './Bench';
import { game } from 'module/game';
import { CardUtil } from 'util/CardUtil';

export const Main = React.memo(() => {
    useUpdatorState();

    const onDragEnd = ({ destination, draggableId }: DropResult, provided: ResponderProvided) => {
        if (!destination) {
            return;
        }
        const cardId = draggableId;
        const card = CardUtil.getCard(cardId as any);
        if (destination.droppableId === 'house') {
            game?.pick(card);
        } else if (destination.droppableId.startsWith('column.')) {
            game?.pick(card, parseInt(destination.droppableId.substr('column.'.length), 10));
        } else {
            const index = game?.findColumnByCard(destination.droppableId);
            if (index !== undefined) {
                game?.pick(card, index);
            }
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Flex
                color="white"
                h="100vh"
                flexDirection="column"
                p={4}
                background="radial-gradient(circle at 50% 0,#016d29,#01431e 62%)"
            >
                {!game ? null : (
                    <React.Fragment>
                        <Flex justifyContent="space-between" p={4}>
                            <Deck />
                            <House />
                        </Flex>
                        <Bench />
                    </React.Fragment>
                )}
            </Flex>
        </DragDropContext>
    );
});
