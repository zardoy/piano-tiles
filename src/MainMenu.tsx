import React from "react";

import { Link } from "react-router-dom";

import { Button, Grid, Typography } from "@material-ui/core";

interface GameMode {
    label: string;
    id: string;
}

const gameModes: GameMode[] = [{
    label: "Peak",
    id: "peak"
}];

const BigText: React.FC<React.ComponentProps<typeof Typography>> = (props) => {
    return <Typography gutterBottom align="center" {...props} />;
};

const MainMenu: React.FC = () => {
    return <Grid container direction="column" justify="flex-start" alignContent="center" style={{ padding: 50 }}>
        <BigText variant="h3">Piano Tiles online</BigText>
        <BigText variant="h5" color="textSecondary">Select Game Mode</BigText>
        {
            gameModes.map(({ id: modeId, label }) =>
                <Button
                    key={modeId}
                    component={Link}
                    to={`/game/${modeId}`}
                    variant="outlined"
                    size="large"
                >{label}</Button>
            )
        }
    </Grid>;
};

export default MainMenu;