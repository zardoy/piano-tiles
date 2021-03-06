import React from "react";

import { HashRouter, Redirect, Route, Switch } from "react-router-dom";

import { CssBaseline } from "@material-ui/core";

import Game from "./Game";
import MainMenu from "./MainMenu";

const App: React.FC = () => {
    return <>
        <CssBaseline />
        <HashRouter>
            <Switch>
                <Route path="/" exact>
                    <MainMenu />
                </Route>
                <Route path="/game/:modeId">
                    <Game />
                </Route>
                <Redirect from="/" to="/unknown path" />
            </Switch>
        </HashRouter>
    </>;
};

export default App;
