import { Box } from '@chakra-ui/react';
import React from 'react';

export const Empty = React.memo(() => {
    return <Box border="3px dashed rgba(255,255,255, 0.5)" w="120px" h="167.6px" borderRadius="5px" />;
});
