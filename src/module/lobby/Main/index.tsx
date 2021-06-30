import { Flex, Image, Button } from '@chakra-ui/react';
import { useHistory } from 'coil-react';
import React from 'react';

export const Main = React.memo(() => {
    const history = useHistory();

    const toGame = () => {
        history.push('/game');
    };

    return (
        <Flex
            h="100vh"
            maxH="100vh"
            overflow="hidden"
            justifyContent="center"
            alignItems="center"
            background="radial-gradient(circle at 50% 0,#016d29,#01431e 62%)"
            flexDirection="column"
        >
            <Image src={require('./asset/title.png')} maxW="80%" mb={12} />
            <Flex flexDirection="column" h="50vh" w="500px" alignItems="center" justifyContent="space-around">
                <Button size="lg" px={24} colorScheme="green" onClick={toGame}>
                    Start Game
                </Button>
                <div />
            </Flex>
        </Flex>
    );
});
