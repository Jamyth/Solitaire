import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { NavigationService } from 'util/NavigationService';
import { ObjectUtil } from 'jamyth-web-util';
import { RecoilLoader } from 'component/RecoilLoader';

export const Main = React.memo(() => {
    return (
        <ChakraProvider>
            <RecoilLoader />
            <Switch>
                {ObjectUtil.toArray(NavigationService, (path, { component }) => (
                    <Route exact key={path} path={path} component={component} />
                ))}
                <Redirect to="/lobby" />
            </Switch>
        </ChakraProvider>
    );
});
