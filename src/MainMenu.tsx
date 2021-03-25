import React from "react";

import { Link } from "react-router-dom";

import { Button, Grid, Slider, Typography } from "@material-ui/core";

import { gameConfig } from "./Game";

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
    return <>
        <Grid container direction="column" justify="flex-start" alignContent="center" style={{ padding: 50 }}>
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
            <BigText variant="h5" color="textSecondary">Game Grid Configuration</BigText>
            <Grid container style={{ width: "auto" }}>
                {
                    (["width", "height"] as (keyof typeof gameConfig.tilesQuantity)[]).map(prop => {
                        const min = prop === "height" ? 2 : 1;
                        return <>
                            <Typography>{prop}</Typography>
                            <Slider
                                key={prop}
                                defaultValue={gameConfig.tilesQuantity[prop]}
                                valueLabelDisplay="auto"
                                step={1}
                                min={min}
                                max={8}
                                onChange={(_, val) => gameConfig.tilesQuantity[prop] = val as number}
                                marks
                            />
                        </>;
                    })
                }
            </Grid>
        </Grid>
    </>;
};

export default MainMenu;