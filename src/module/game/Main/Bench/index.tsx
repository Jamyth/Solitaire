import { Flex } from '@chakra-ui/react';
import React from 'react';
import { Column } from './Column';
import { useUpdatorState } from 'util/decorators/ForceRender';

export const Bench = React.memo(() => {
    useUpdatorState();

    const columns = [...new Array(7)];

    return (
        <Flex flex={1} p={4} justifyContent="space-around">
            {columns.map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key -- only index available
                <Column index={i} key={i} />
            ))}
        </Flex>
    );
});
