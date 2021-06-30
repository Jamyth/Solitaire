import { Card } from 'component/Card';
import { useGameV2Action } from 'module/game-v2';
import { useGameV2State } from 'module/game-v2/hooks';
import React from 'react';
import { useUpdatorState } from 'util/decorators/ForceRender';
import type { CardV2 } from 'util/SolitaireV2';
import { solitaireV2 } from 'module/game-v2';

interface Props {
    colIndex: number;
    index: number;
    offset: number;
    card: CardV2;
}

export const RevealedCard = React.memo(({ colIndex, index, offset, card }: Props) => {
    useUpdatorState();
    const selectedType = useGameV2State((state) => state.selectedCardType);
    const selectedCardIndex = useGameV2State((state) => state.selectedCardIndex);
    const selectedColumnIndex = useGameV2State((state) => state.selectedColumnIndex);

    const { selectColumnCard, reset } = useGameV2Action();

    const isThisColumn = selectedType === 'column' && selectedColumnIndex === colIndex;

    const outline =
        isThisColumn && selectedCardIndex !== null && selectedCardIndex <= index ? '5px solid #d4af37' : undefined;
    const selectThisCard = () => {
        selectColumnCard(index, colIndex);
    };
    let onClick: (e: React.MouseEvent<HTMLDivElement>) => void = reset;

    if ((isThisColumn && selectedCardIndex !== index) || selectedCardIndex === null) {
        onClick = selectThisCard;
    }
    if (selectedType === 'deck') {
        onClick = (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            solitaireV2?.pickDeckToColumn(colIndex);
            reset();
        };
    }
    if (!isThisColumn && selectedColumnIndex !== null && selectedCardIndex !== null) {
        onClick = (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            solitaireV2?.pickColumnToColumn(selectedColumnIndex, selectedCardIndex, colIndex);
            reset();
        };
    }
    return (
        <Card
            outline={outline}
            position="absolute"
            top={`${(index + offset) * 30}px`}
            content={card}
            onClick={onClick}
            key={`${card.type}.${card.value}`}
        />
    );
});
