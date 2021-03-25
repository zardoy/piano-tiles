import React, { useEffect, useRef, useState } from "react";

import { Gamepad, Keyboard, or as controlsOr } from "contro";
import _ from "lodash";
import { Link } from "react-router-dom";

import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";

export const gameConfig = {
    maxWidth: 600,
    tilesQuantity: {
        width: 4,
        height: 4
    },
    showKeyboardOrGamepadHints: true
};

const controlsMap: Record<string, string> = {
    // keyboard key then xbox controller button
    1: "D A",
    2: "F B",
    3: "J X",
    4: "K Y",
};

const getRandomTilePos = () => _.random(gameConfig.tilesQuantity.width - 1);

const useStyles = makeStyles({
    canvas: {
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        maxWidth: gameConfig.maxWidth
    },
    score: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        fontFamily: "Graduate",
        fontWeight: "bold",
        pointerEvents: "none"
    },
    backButton: {
        position: "fixed",
        top: 0,
        left: 0,
        fontSize: "1.2em"
    }
});

const Game: React.FC = () => {
    const classes = useStyles();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [score, setScore] = useState(0);

    useEffect(() => {
        // todo: replace with engine

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        const getTileSize = () => {
            return {
                width: canvas.width / tilesQuantity.width,
                height: canvas.height / tilesQuantity.height,
            };
        };

        const { tilesQuantity } = gameConfig;

        const resetTilePositions = () => _.times(tilesQuantity.height + 1, getRandomTilePos);

        let tilePositions = resetTilePositions();

        let offsetPerc = 0;

        let activeInput: "touch" | "keyboard" | "gamepad" = "touch";

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 0.5;
            ctx.beginPath();

            const tileSize = getTileSize();

            const offset = offsetPerc * tileSize.height;

            _.times(tilesQuantity.width, xRel => {
                const x = xRel / tilesQuantity.width * canvas.width;
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
            });
            _.times(tilesQuantity.height, yRel => {
                const y = yRel * tileSize.height + offset;
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
            });
            ctx.stroke();

            // not the best implementation tbh
            const drawTile = (xPos: number, yPos: number, clickedAnim?: number) => {
                if (clickedAnim !== undefined) {
                    ctx.fillStyle = "#afaeae";
                }
                const startPos = {
                    x: xPos * tileSize.width,
                    y: yPos * tileSize.height + offset
                };
                ctx.fillRect(
                    startPos.x,
                    startPos.y,
                    tileSize.width,
                    tileSize.height
                );
                ctx.fillStyle = "black";
                if (clickedAnim) {
                    ctx.fillRect(
                        startPos.x + clickedAnim,
                        startPos.y + clickedAnim,
                        tileSize.width - clickedAnim * 2,
                        tileSize.height - clickedAnim * 2
                    );
                }
            };

            tilePositions.forEach((xPos, yPos) => {
                const posFromEnd = tilePositions.length - 1 - yPos;
                drawTile(
                    xPos,
                    yPos - 1,
                    posFromEnd === 0 ? 0 :
                        posFromEnd === 1 && offset ? Math.min(offset, 10) :
                            undefined
                );
            });

            if (activeInput !== "touch" && gameConfig.showKeyboardOrGamepadHints) {
                ctx.fillStyle = "white";
                ctx.font = "60px sans-serif";
                ctx.textAlign = "center";
                const tileNumber = tilePositions.slice(-2)[0] + 1;
                const keyboardKey = tilesQuantity.width > 4 ? tileNumber.toString() : controlsMap[tileNumber].split(" ")[0];
                ctx.fillText(
                    activeInput === "keyboard" ? keyboardKey :
                        controlsMap[tileNumber].split(" ")[1],
                    tileSize.width * tilePositions.slice(-2)[0] + tileSize.width / 2,
                    tileSize.height * (tilesQuantity.height - 2) + tileSize.height / 2
                );
                ctx.fillStyle = "black";
            }
        };
        const resize = () => {
            canvas.width = Math.min(window.innerWidth, gameConfig.maxWidth);
            canvas.height = window.innerHeight;
            render();
        };
        resize();
        const registerHit = (xPos: number) => {
            if (xPos === tilePositions.slice(-2)[0]) {
                setScore(score => score + 1);
                // todo-high: use javascript.info animation approach to increase fps
                const interval = setInterval(() => {
                    if ((offsetPerc += 0.15) >= 1) {
                        clearInterval(interval);
                        offsetPerc = 0;
                        tilePositions.pop();
                        tilePositions.unshift(getRandomTilePos());
                    }
                    render();
                }, 5);
            } else {
                console.log("Wrong tile", xPos, tilePositions.slice(-2)[0]);
                // tilePositions = resetTilePositions();
                setScore(0);
            }
            render();
        };
        const canvasClick = ({ clientY, clientX }: { clientY: number, clientX: number; }) => {
            // let boundingClientReact = canvas.getBoundingClientRect();
            // let canvasX = clientX - boundingClientReact.left;
            // let canvasY = clientY - boundingClientReact.top;
            let canvasX = clientX;
            let canvasY = clientY;
            const tileSize = getTileSize();
            if (
                canvasY < (tilesQuantity.height - 2) * tileSize.height ||
                canvasY > (tilesQuantity.height - 1) * tileSize.height
            ) return;
            const xPos = Math.ceil(canvasX / (canvas.width / tilesQuantity.width)) - 1;
            registerHit(xPos);
        };
        const pointerHandle = (event: PointerEvent) => {
            activeInput = "touch";
            // todo investigate
            canvasClick({ clientY: event.offsetY, clientX: event.offsetX });
        };
        const cancelTouchMove = (event: TouchEvent) => event.preventDefault();
        window.addEventListener("resize", resize);
        canvas.addEventListener("pointerdown", pointerHandle);
        canvas.addEventListener("touchstart", cancelTouchMove);

        // handle keyboard & gamepad input
        const keyboard = new Keyboard();
        const gamepad = new Gamepad();

        let inputReleased = true;

        const interval = setInterval(() => {
            // todo fix types
            let somethingWasPressed = false;
            for (const tileNumber in controlsMap) {
                const [keyboardKey, gamepadButton] = controlsMap[tileNumber].split(" ");
                const pressed = controlsOr(
                    keyboard.key(keyboardKey),
                    keyboard.key(tileNumber),
                    gamepad.button(gamepadButton),
                ).query();
                if (!pressed) continue;
                somethingWasPressed = true;
                if (inputReleased) registerHit(+tileNumber - 1);
                break;
            }
            inputReleased = !somethingWasPressed;
            if (somethingWasPressed && gamepad.isConnected()) activeInput = "gamepad";
        }, 10);
        const detectKeyboardInput = () => {
            activeInput = "keyboard";
            render();
        };
        window.addEventListener("keydown", detectKeyboardInput);
        return () => {
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("pointerdown", pointerHandle);
            canvas.removeEventListener("touchstart", cancelTouchMove);
            window.removeEventListener("keydown", detectKeyboardInput);
            clearInterval(interval);
        };
    }, []);

    return <>
        <Button
            className={classes.backButton}
            hidden={score !== 0}
            component={Link}
            to="/"
            color="primary"
        // doesn't work properly with startIcon for some reason
        >
            <ArrowBackIos />Back
        </Button>
        <Grid container justify="center">
            <canvas
                ref={canvasRef}
                className={classes.canvas}
            />
        </Grid>
        <Typography
            align="center"
            color="error"
            className={classes.score}
            variant="h3"
        >{score}</Typography>
    </>;
};

export default Game;
