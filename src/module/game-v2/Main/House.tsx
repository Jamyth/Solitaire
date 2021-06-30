import { HStack } from '@chakra-ui/react';
import React from 'react';
import { useUpdatorState } from 'util/decorators/ForceRender';
import { solitaireV2 } from 'module/game-v2';
import { Card } from 'component/Card';
import { useGameV2State } from '../hooks';

export const House = React.memo(() => {
    useUpdatorState();

    const hasSelected = useGameV2State((state) => state.selectedCardIndex !== null && state.selectedCardType !== null);
    const selectedType = useGameV2State((state) => state.selectedCardType);
    const selectedCard = useGameV2State((state) => state.selectedCardIndex);
    const selectedColumn = useGameV2State((state) => state.selectedColumnIndex);

    if (!solitaireV2) {
        return null;
    }

    const diamonds = solitaireV2.getHouse('diamonds');
    const clubs = solitaireV2.getHouse('clubs');
    const hearts = solitaireV2.getHouse('hearts');
    const spades = solitaireV2.getHouse('spades');

    const houses = [diamonds, clubs, hearts, spades];

    const onClick = hasSelected
        ? () => {
              if (selectedType === 'column' && selectedColumn !== null && selectedCard !== null) {
                  solitaireV2?.pickColumnToHouse(selectedColumn, selectedCard);
              } else if (selectedType === 'deck') {
                  solitaireV2?.pickDeckToHouse();
              }
          }
        : undefined;

    return (
        <HStack spacing={4} onClick={onClick}>
            {houses.map((house, i) => {
                if (!house.length) {
                    // eslint-disable-next-line react/no-array-index-key -- index only
                    return <Card.Empty key={i} />;
                }
                const lastCard = solitaireV2?.getLastCard(house);
                if (lastCard) {
                    return <Card content={lastCard} key={`${lastCard.type}.${lastCard.value}`} />;
                }
                return null;
            })}
        </HStack>
    );
});
