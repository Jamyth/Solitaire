import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'coil-react';

export const VictoryModal = React.memo(() => {
    const history = useHistory();

    return (
        <Modal isOpen onClose={() => history.replace('/lobby')} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Congratulations</ModalHeader>
                <ModalCloseButton />
                <ModalBody>You have completed the level !</ModalBody>
                <ModalFooter justifyContent="center">
                    <Button onClick={() => history.go(0)} colorScheme="green">
                        Start a New Game !
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
});
