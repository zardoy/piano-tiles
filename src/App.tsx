import React, { useState } from 'react';
import MainMenu from './MainMenu';
import GameCanvas from './GameCanvas';

export const availableGameModes = {
    "peak": ""
};

export type GameModes = keyof typeof availableGameModes | null;

const App: React.FC = () => {
    let [gameMode, setGameMode] = useState(null as GameModes);
    return <div className="d-flex justify-content-center">
        <div
            className="app"
            style={{
                maxWidth: "600px"
            }}
        >
            {
                gameMode === null ? <MainMenu setGameMode={setGameMode} /> : <GameCanvas gameMode={gameMode} />
            }
        </div>
    </div>
}

export default App;
