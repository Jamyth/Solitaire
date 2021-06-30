import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useUpdatorState } from 'util/decorators/ForceRender';
import { Column } from './Column';

export const Bench = React.memo(() => {
    useUpdatorState();

    const columns = [...new Array(7)];

    return (
        <Flex flex={1} p={4} justifyContent="space-around">
            {columns.map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key -- index only
                <Column colIndex={i} key={i} />
            ))}
        </Flex>
    );
});
