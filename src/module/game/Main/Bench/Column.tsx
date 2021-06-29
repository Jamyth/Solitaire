import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useUpdatorState } from 'util/decorators/ForceRender';
import { game } from 'module/game';
import { Card } from 'component/Card';
import { Box } from '@chakra-ui/react';

interface Props {
    index: number;
}

export const Column = React.memo(({ index }: Props) => {
    useUpdatorState();

    const cards = game?.getColumnCards(index) ?? [];

    const nested = cards.reduceRight<any>((comp, card, i) => {
        const id = `${card.type}.${card.value}`;
        const visible = card.visible;
        const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            game?.flipCard(card, index);
        };
        if (!visible) {
            return (
                <Box position="relative" onClick={onClick}>
                    <Card content={card} />
                    <Box position="absolute" top="20%">
                        {comp}
                    </Box>
                </Box>
            );
        }
        return (
            <Draggable draggableId={id} index={i}>
                {(draggableProvided) => (
                    <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                    >
                        {comp === null ? (
                            <Droppable droppableId={id}>
                                {(droppableProvided, snapshot) => (
                                    <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                                        <Box
                                            position="relative"
                                            backgroundColor={snapshot.isDraggingOver ? 'blue.700' : undefined}
                                        >
                                            <Card content={card} />
                                            <Box position="absolute" top="20%">
                                                {comp}
                                            </Box>
                                        </Box>
                                    </div>
                                )}
                            </Droppable>
                        ) : (
                            <Box position="relative" onClick={onClick}>
                                <Card content={card} />
                                <Box position="absolute" top="20%">
                                    {comp}
                                </Box>
                            </Box>
                        )}
                    </div>
                )}
            </Draggable>
        );
    }, null);

    return (
        <Droppable droppableId={`column.${index}`}>
            {(droppableProvided) => (
                <div
                    style={{ minWidth: '120px' }}
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                >
                    {nested}
                </div>
            )}
        </Droppable>
    );
});
