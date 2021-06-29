import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Card } from 'component/Card';
import { game } from 'module/game';
import { useUpdatorState } from 'util/decorators/ForceRender';
import { Draggable, Droppable } from 'react-beautiful-dnd';

export const Deck = React.memo(() => {
    useUpdatorState();
    const cards = [...new Array(3)].map((_, i) => {
        // eslint-disable-next-line react/no-array-index-key -- only index is available
        return <Card.Background position="absolute" left={i * 6} key={i} />;
    });

    return (
        <Droppable droppableId="draw">
            {(droppableProvided) => (
                <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                    <Flex>
                        <Box position="relative" w="200px" onClick={game?.getNextShownCards} cursor="pointer">
                            {cards}
                        </Box>
                        <Box position="relative">
                            {game?.getShownCards().map((_, i) => {
                                if (i === (game?.getShownCards().length ?? 0) - 1) {
                                    return (
                                        <Draggable
                                            draggableId={`${_.type}.${_.value}`}
                                            index={0}
                                            key={`${_.type}-${_.value}`}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <Card content={_} position="absolute" />
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                }
                                return <Card content={_} position="absolute" key={`${_.type}-${_.value}`} />;
                            })}
                        </Box>
                    </Flex>
                    {droppableProvided.placeholder}
                </div>
            )}
        </Droppable>
    );
});
