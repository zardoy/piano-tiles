import React from "react";

import { MemoryRouter, Redirect, Route, Switch } from "react-router-dom";

import { CssBaseline } from "@material-ui/core";

import Game from "./Game";
import MainMenu from "./MainMenu";

const App: React.FC = () => {
    return <>
        <CssBaseline />
        <MemoryRouter>
            <Switch>
                <Route path="/" exact>
                    <MainMenu />
                </Route>
                <Route path="/game/:modeId">
                    <Game />
                </Route>
                <Redirect from="/" to="/" />
            </Switch>
        </MemoryRouter>
    </>;
};

export default App;
