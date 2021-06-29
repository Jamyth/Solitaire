import React from 'react';
import { Background } from './Background';
import { Empty } from './Empty';
import type { Card as CardProps } from 'util/Solitaire';
import { Solitaire } from 'util/Solitaire';
import { CardUtil } from 'util/CardUtil';
import type { BoxProps } from '@chakra-ui/react';
import { Box, Flex } from '@chakra-ui/react';

export interface BaseProps
    extends Omit<
        BoxProps,
        'w' | 'h' | 'backgroundColor' | 'backgroundImage' | 'backgroundSize' | 'borderRadius' | 'shadow'
    > {}

interface Props extends BaseProps {
    content: CardProps;
}

export class Card extends React.PureComponent<Props> {
    static Background = Background;
    static Empty = Empty;

    render() {
        const { content, ...props } = this.props;
        const symbol = CardUtil.getSymbol(content.type);
        const value = CardUtil.getValue(content.value);
        if (!content.visible) {
            return <Background />;
        }
        return (
            <Flex
                flexDirection="column"
                p={2}
                w="120px"
                h="167.6px"
                borderRadius="5px"
                backgroundColor="white"
                shadow="md"
                userSelect="none"
                color={Solitaire.isRed(content) ? 'red.600' : 'black'}
                {...props}
            >
                <Box>
                    {value}
                    <Box>{symbol}</Box>
                </Box>
                <Flex fontSize="30px" flex={1} justifyContent="center" alignItems="center">
                    {symbol}
                </Flex>
                <Box textAlign="right">
                    <Box>{symbol}</Box>
                    {value}
                </Box>
            </Flex>
        );
    }
}
