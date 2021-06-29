import { HStack } from '@chakra-ui/react';
import { Card } from 'component/Card';
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useUpdatorState } from 'util/decorators/ForceRender';
import { game } from 'module/game';

export const House = React.memo(() => {
    useUpdatorState();

    const diamonds = game?.getHouseCards('diamonds') ?? [];
    const clubs = game?.getHouseCards('clubs') ?? [];
    const hearts = game?.getHouseCards('hearts') ?? [];
    const spades = game?.getHouseCards('spades') ?? [];

    const houses = [diamonds, clubs, hearts, spades];

    return (
        <Droppable droppableId="house">
            {(droppableProvided, snapshot) => (
                <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                    <HStack spacing={4} backgroundColor={snapshot.isDraggingOver ? 'blue.700' : undefined}>
                        {houses.map((house, i) => {
                            if (!house.length) {
                                // eslint-disable-next-line react/no-array-index-key -- only index available
                                return <Card.Empty key={i} />;
                            }

                            const card = house[house.length - 1];
                            return <Card content={card} key={`${card.type}.${card.value}`} />;
                        })}
                    </HStack>
                    {droppableProvided.placeholder}
                </div>
            )}
        </Droppable>
    );
});
