import React, { useEffect, useState, useRef, useCallback } from "react";
import { GameModes } from "./App";

interface Props {
    gameMode: Exclude<GameModes, null>
}

type CanvasDimensions = {
    width: number
    height: number,
};

const maxCanvasWidth = 600;

const gameConfig = {
    tilesQuantity: {
        width: 4,
        height: 4
    }
}

const getDerivedCanvasSize = (): CanvasDimensions => {
    let screenWidth = window.document.documentElement.offsetWidth;
    return {
        width: screenWidth < maxCanvasWidth ? screenWidth : maxCanvasWidth,
        height: window.document.documentElement.clientHeight
    }
}

const random = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);

const GameCanvas: React.FC<Props> = () => {
    let canvasRef = useRef(null as HTMLCanvasElement | null);
    let [canvasDimensions, setCanvasDimensions] = useState(getDerivedCanvasSize());
    useEffect(() => {//resize canvas on window resize
        const updateCanvasSize = () => setCanvasDimensions(getDerivedCanvasSize());
        window.addEventListener("resize", updateCanvasSize);
        return () => {
            window.removeEventListener("resize", updateCanvasSize);
        }
    }, []);

    useEffect(() => {//update canvas frame
        if (canvasRef.current === null) return;
        let tilesQuantity = gameConfig.tilesQuantity;
        let tilesPos = new Array(gameConfig.tilesQuantity.height + 1).fill(null).map(() => random(0, tilesQuantity.width - 1));
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
            for (let xRel = 0; xRel < tilesQuantity.width; xRel++) {//Vertical lines
                ctx.beginPath();
                let xPos = xRel * tileWidth;
                ctx.moveTo(xPos, 0);
                ctx.lineTo(xPos, canvasEl.height);
                ctx.stroke();
            }
            for (let yRel = 0; yRel < tilesQuantity.height; yRel++) {//Horizontal lines
                ctx.beginPath();
                let yPos = yRel * tileHeight;
                ctx.moveTo(0, yPos);
                ctx.lineTo(canvasEl.width, yPos);
                ctx.stroke();
                ctx.fillRect(tilesPos[yRel] * tileWidth, yPos, tileWidth, tileHeight);
            }
        });
        return () => {
            clearInterval(frameUpdater);
        }
    }, [canvasRef]);

    let clickCanvas = useCallback(event => {
        if (canvasRef.current === null) return;
        let boundingClientReact = canvasRef.current.getBoundingClientRect();
        let canvasY = event.clientY - boundingClientReact.top;
        let canvasX = event.clientX - boundingClientReact.left;
        console.log(canvasX, canvasY);
    }, []);

    return <canvas
        ref={canvasRef}
        onClick={clickCanvas}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
        style={{
            width: canvasDimensions.width,
            height: canvasDimensions.height
        }} />
}

export default GameCanvas;