import { Box } from '@chakra-ui/react';
import React from 'react';
import type { BaseProps } from '../Card';

interface Props extends BaseProps {}

export const Background = React.memo(({ ...props }: Props) => {
    return (
        <Box
            {...props}
            w="120px"
            h="167.6px"
            backgroundColor="#00b7ff"
            backgroundImage={`url(${require('./asset/background.svg')})`}
            backgroundSize="contain"
            borderRadius="5px"
            shadow="md"
        />
    );
});
