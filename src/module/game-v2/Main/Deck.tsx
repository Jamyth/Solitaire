import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { useUpdatorState } from 'util/decorators/ForceRender';
import { solitaireV2 } from 'module/game-v2';
import { Card } from 'component/Card';
import { useGameV2Action } from '../index';
import { useGameV2State } from '../hooks';

export const Deck = React.memo(() => {
    useUpdatorState();
    const isDeck = useGameV2State((state) => state.selectedCardType === 'deck');
    const selectedIndex = useGameV2State((state) => state.selectedCardIndex);
    const { selectDeckCard } = useGameV2Action();

    if (!solitaireV2) {
        return null;
    }

    const cards = [...new Array(3)].map((_, i) => {
        // eslint-disable-next-line react/no-array-index-key -- only index
        return <Card.Background position="absolute" left={i * 6} key={i} />;
    });

    return (
        <Flex>
            <Box
                position="relative"
                w="200px"
                onClick={() => {
                    solitaireV2?.toNextDeckPage();
                }}
                cursor="pointer"
            >
                {cards}
            </Box>
            <Box position="relative">
                {solitaireV2.getCurrentDeckPage().map((_, i) => {
                    const isLastCard = solitaireV2?.isLastCard(i, solitaireV2.getCurrentDeckPage()) ?? false;

                    const onSelect = isLastCard
                        ? (e: React.MouseEvent<HTMLDivElement>) => {
                              e.stopPropagation();
                              selectDeckCard(i);
                          }
                        : undefined;

                    const border = isDeck && selectedIndex === i ? '5px solid #d4af37' : undefined;

                    return (
                        <Card
                            position="absolute"
                            left={`${i * 40}px`}
                            outline={border}
                            content={_}
                            onClick={onSelect}
                            key={`${_.type}.${_.value}`}
                        />
                    );
                })}
            </Box>
        </Flex>
    );
});
