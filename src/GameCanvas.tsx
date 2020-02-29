import React, { useEffect, useState, useRef, useCallback } from "react";
import { GameModes } from "./App";

const maxCanvasWidth = 600;

const gameConfig = {
    tilesQuantity: {
        width: 4,
        height: 4
    }
}

interface Props {
    gameMode: Exclude<GameModes, null>
}

type CanvasDimensions = {
    width: number
    height: number,
};

const getDerivedCanvasSize = (): CanvasDimensions => {
    let screenWidth = window.document.documentElement.offsetWidth;
    return {
        width: screenWidth < maxCanvasWidth ? screenWidth : maxCanvasWidth,
        height: window.document.documentElement.clientHeight
    }
}

const random = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);

const getRandomTilePos = () => random(0, gameConfig.tilesQuantity.width - 1);

const GameCanvas: React.FC<Props> = () => {
    let [fps, setFps] = useState(0);
    let [score, setScore] = useState(0);
    let canvasRef = useRef(null as HTMLCanvasElement | null);
    let [canvasSize, setCanvasSize] = useState(getDerivedCanvasSize());
    let tilesPos = new Array(gameConfig.tilesQuantity.height - 1).fill(null).map(() => getRandomTilePos());
    let clickedTilePos: number | null = null;
    let lastCalledTime = performance.now();

    const registerTileHit = (tileNumber/* from 1 */: number) => {
        if (tileNumber < 1 || tileNumber > gameConfig.tilesQuantity.width) return;
        let tilePos = tileNumber - 1;
        if (tilePos === tilesPos.slice(-1)[0]) {
            tilesPos.pop();
            tilesPos.unshift(random(0, gameConfig.tilesQuantity.width - 1));
            setScore(count => count + 1);
            clickedTilePos = tilePos;
        } else {
            setScore(0);
            //j
        }
    }

    useEffect(() => {//resize canvas effect
        const updateCanvasSize = () => setCanvasSize(getDerivedCanvasSize());
        window.addEventListener("resize", updateCanvasSize);
        return () => window.removeEventListener("resize", updateCanvasSize);
    }, []);

    useEffect(() => {//update canvas effect
        if (canvasRef.current === null) return;
        let tilesQuantity = gameConfig.tilesQuantity;
        let frameUpdater = setInterval(() => {
            let canvasEl = canvasRef.current;
            if (canvasEl === null) return;
            let tileWidth = canvasEl.width / tilesQuantity.width,
                tileHeight = canvasEl.height / tilesQuantity.height;
            let ctx = canvasEl.getContext("2d");
            if (ctx === null) return;
            //Cleaning prev frame
            ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
            //Drawing grid
            ctx.strokeStyle = "gray";
            ctx.fillStyle = "black";
            for (let yRel = 0; yRel < tilesQuantity.height; yRel++) {//Horizontal lines and tiles
                let yPos = yRel * tileHeight;
                if (yRel < tilesQuantity.height - 1) {
                    ctx.fillRect(tilesPos[yRel] * tileWidth, yPos, tileWidth, tileHeight);//regular tile
                } else if (clickedTilePos !== null) {
                    ctx.fillStyle = "rgb(180, 180, 180)";
                    ctx.fillRect(clickedTilePos * tileWidth, yPos, tileWidth, tileHeight);//clicked tile
                    ctx.fillStyle = "black";
                }
                ctx.beginPath();
                ctx.moveTo(0, yPos);
                ctx.lineTo(canvasEl.width, yPos);
                ctx.stroke();
            }
            for (let xRel = 0; xRel < tilesQuantity.width; xRel++) {//Vertical lines
                ctx.beginPath();
                let xPos = xRel * tileWidth;
                ctx.moveTo(xPos, 0);
                ctx.lineTo(xPos, canvasEl.height);
                ctx.stroke();
            }
            let delta = (performance.now() - lastCalledTime) / 1000;
            lastCalledTime = performance.now();
            setFps(Math.round(1 / delta));
        });
        return () => {
            clearInterval(frameUpdater);
        }
    }, [canvasRef]);

    let canvasClickListener = useCallback(event => {
        if (canvasRef.current === null) return;
        let boundingClientReact = canvasRef.current.getBoundingClientRect();
        let canvasY = event.clientY - boundingClientReact.top;
        let canvasX = event.clientX - boundingClientReact.left;
        // if (canvasY < canvasRef.current.height / gameConfig.tilesQuantity.height * (gameConfig.tilesQuantity.height - 1)) return;
        let clickedTilePos = Math.ceil(canvasX / (canvasRef.current.width / gameConfig.tilesQuantity.width));
        registerTileHit(clickedTilePos);
    }, []);

    useEffect(() => {//register keyboard input
        let keyListener = (event: KeyboardEvent) => {
            let code = event.code;
            ["Digit", "Numpad"].forEach((selector) => {
                if (code.startsWith(selector)) registerTileHit(+code.slice(selector.length));
            })
        }

        window.addEventListener("keydown", keyListener);
        return () => window.removeEventListener("keydown", keyListener);
    }, []);

    return <>
        <code>
            <h1 className="score-counter">
                {score < 100 ? (score + 100).toString().slice(1) : score}
                <br />
                <span className="fps-counter">{fps}</span>
            </h1>
        </code>
        <canvas
            ref={canvasRef}
            onClick={canvasClickListener}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{
                width: canvasSize.width,
                height: canvasSize.height
            }} />
    </>
}

export default GameCanvas;