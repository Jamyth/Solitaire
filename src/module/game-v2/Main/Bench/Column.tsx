import React from 'react';
import { useUpdatorState } from 'util/decorators/ForceRender';
import { solitaireV2, useGameV2Action } from 'module/game-v2';
import { Box } from '@chakra-ui/react';
import { Card } from 'component/Card';
import { useGameV2State } from 'module/game-v2/hooks';
import { RevealedCard } from './RevealedCard';

interface Props {
    colIndex: number;
}

export const Column = React.memo(({ colIndex }: Props) => {
    useUpdatorState();
    const selectedType = useGameV2State((state) => state.selectedCardType);
    const selectedCardIndex = useGameV2State((state) => state.selectedCardIndex);
    const selectedColumnIndex = useGameV2State((state) => state.selectedColumnIndex);

    const { reset } = useGameV2Action();

    if (!solitaireV2) {
        return null;
    }

    const column = solitaireV2.getColumn(colIndex);

    const onColumnClick = () => {
        if (selectedColumnIndex !== null && selectedCardIndex !== null) {
            solitaireV2?.pickColumnToColumn(selectedColumnIndex, selectedCardIndex, colIndex);
            reset();
        } else if (selectedType === 'deck') {
            solitaireV2?.pickDeckToColumn(colIndex);
            reset();
        }
    };

    return (
        <Box minW="120px" position="relative" onClick={onColumnClick}>
            {column.hiddenCards.map((_, i) => {
                const isLastCard = solitaireV2?.isLastCard(i, column.hiddenCards) && column.cards.length === 0;
                const onClick = isLastCard
                    ? () => {
                          solitaireV2?.flipHiddenCard(colIndex);
                      }
                    : reset;

                // eslint-disable-next-line react/no-array-index-key -- index only
                return <Card.Background position="absolute" top={`${i * 30}px`} onClick={onClick} key={i} />;
            })}
            {column.cards.map((card, i) => (
                <RevealedCard
                    card={card}
                    index={i}
                    colIndex={colIndex}
                    offset={column.hiddenCards.length}
                    key={`${card.type}.${card.value}`}
                />
            ))}
        </Box>
    );
});
