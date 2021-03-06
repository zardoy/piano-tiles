import React, { useEffect, useRef } from "react";

import _ from "lodash";

import { Typography } from "@material-ui/core";

import { createProgram } from "./webgl-util";

const gameConfig = {
    maxWidth: 600,
    tilesQuantity: {
        width: 4,
        height: 4
    }
};
// template literal tag for optional syntax highliting (you need to install glsl tag extension in VSCode)
const glsl = (x: any) => x;

const getRandomTilePos = () => _.random(0, gameConfig.tilesQuantity.width - 1);

const Game: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // it doesn't make sense to use state hook here
    const scoreRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;

        // https://webglfundamentals.org/webgl/lessons/en/webgl-shaders-and-glsl.html
        // could be done in much simpler way. But I want to know how webgl works
        const gl = canvas.getContext("webgl");
        if (!gl) {
            throw new Error("WebGL isn't supported on your platform");
        }
        // SHADERS
        const vertexCode = glsl`
attribute vec4 a_position;

void main() {
    gl_Position = a_position;
}
`;
        const fragmentCode = glsl`
precision mediump float;
    
void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
}
`;
        const shaderProgram = createProgram(gl, vertexCode, fragmentCode);

        const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
        gl.enableVertexAttribArray(positionAttributeLocation);

        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        const positionBuffer = gl.createBuffer();

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        gl.useProgram(shaderProgram);

        let score = 0;
        const render = () => {
            // scoreRef.current!.innerText = score < 100 ? (score + 100).toString().slice(1) : score
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                0, 0,
                0, .5,
                0, 1
            ]), gl.STATIC_DRAW);

            gl.drawArrays(gl.TRIANGLES, 0, 3);

            requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener("resize", resize);
        };
    }, []);

    let tilesPos = new Array(gameConfig.tilesQuantity.height - 1).fill(null).map(() => getRandomTilePos());
    let clickedTilePos: number | null = null;

    // const registerTileHit = (tileNumber/* from 1 */: number) => {
    //     if (tileNumber < 1 || tileNumber > gameConfig.tilesQuantity.width) return;
    //     let tilePos = tileNumber - 1;
    //     if (tilePos === tilesPos.slice(-1)[0]) {
    //         tilesPos.pop();
    //         tilesPos.unshift(random(0, gameConfig.tilesQuantity.width - 1));
    //         setScore(count => count + 1);
    //         clickedTilePos = tilePos;
    //     } else {
    //         setScore(0);
    //         //j
    //     }
    // }

    // useEffect(() => {//update canvas effect
    //     if (canvasRef.current === null) return;
    //     let tilesQuantity = gameConfig.tilesQuantity;
    //     let frameUpdater = setInterval(() => {
    //         let canvasEl = canvasRef.current;
    //         if (canvasEl === null) return;
    //         let tileWidth = canvasEl.width / tilesQuantity.width,
    //             tileHeight = canvasEl.height / tilesQuantity.height;
    //         let ctx = canvasEl.getContext("2d");
    //         if (ctx === null) return;
    //         //Cleaning prev frame
    //         ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    //         //Drawing grid
    //         ctx.strokeStyle = "gray";
    //         ctx.fillStyle = "black";
    //         for (let yRel = 0; yRel < tilesQuantity.height; yRel++) {//Horizontal lines and tiles
    //             let yPos = yRel * tileHeight;
    //             if (yRel < tilesQuantity.height - 1) {
    //                 ctx.fillRect(tilesPos[yRel] * tileWidth, yPos, tileWidth, tileHeight);//regular tile
    //             } else if (clickedTilePos !== null) {
    //                 ctx.fillStyle = "rgb(180, 180, 180)";
    //                 ctx.fillRect(clickedTilePos * tileWidth, yPos, tileWidth, tileHeight);//clicked tile
    //                 ctx.fillStyle = "black";
    //             }
    //             ctx.beginPath();
    //             ctx.moveTo(0, yPos);
    //             ctx.lineTo(canvasEl.width, yPos);
    //             ctx.stroke();
    //         }
    //         for (let xRel = 0; xRel < tilesQuantity.width; xRel++) {//Vertical lines
    //             ctx.beginPath();
    //             let xPos = xRel * tileWidth;
    //             ctx.moveTo(xPos, 0);
    //             ctx.lineTo(xPos, canvasEl.height);
    //             ctx.stroke();
    //         }
    //         let delta = (performance.now() - lastCalledTime) / 1000;
    //         lastCalledTime = performance.now();
    //         setFps(Math.round(1 / delta));
    //     });
    //     return () => {
    //         clearInterval(frameUpdater);
    //     };
    // }, [canvasRef]);

    // let canvasClickListener = useCallback(event => {
    //     if (canvasRef.current === null) return;
    //     let boundingClientReact = canvasRef.current.getBoundingClientRect();
    //     let canvasY = event.clientY - boundingClientReact.top;
    //     let canvasX = event.clientX - boundingClientReact.left;
    //     // if (canvasY < canvasRef.current.height / gameConfig.tilesQuantity.height * (gameConfig.tilesQuantity.height - 1)) return;
    //     let clickedTilePos = Math.ceil(canvasX / (canvasRef.current.width / gameConfig.tilesQuantity.width));
    //     registerTileHit(clickedTilePos);
    // }, []);

    // useEffect(() => {//register keyboard input
    //     let keyListener = (event: KeyboardEvent) => {
    //         let code = event.code;
    //         ["Digit", "Numpad"].forEach((selector) => {
    //             if (code.startsWith(selector)) registerTileHit(+code.slice(selector.length));
    //         });
    //     };

    //     window.addEventListener("keydown", keyListener);
    //     return () => window.removeEventListener("keydown", keyListener);
    // }, []);

    return <>
        <code>
            <Typography
                variant="h4"
                ref={scoreRef}
            />
        </code>
        <canvas
            ref={canvasRef}
        // onClick={canvasClickListener}
        />
    </>;
};

export default Game;