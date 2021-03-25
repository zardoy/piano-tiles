import React from "react";

import { Link as RouterLink } from "react-router-dom";

import { Button, Checkbox, Grid, Link, Slider, Typography } from "@material-ui/core";

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
                        component={RouterLink}
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
                <Typography>
                    <Checkbox
                        defaultChecked={gameConfig.showKeyboardOrGamepadHints}
                        onChange={(_, checked) => gameConfig.showKeyboardOrGamepadHints = checked}
                    />Show keyboard & gamepad hints
                </Typography>
            </Grid>
            <Link color="textSecondary" href="https://github.com/zardoy/piano-tiles" style={{ position: "absolute", bottom: 0, right: 0, }}>View on GitHub</Link>
        </Grid>
    </>;
};

export default MainMenu;