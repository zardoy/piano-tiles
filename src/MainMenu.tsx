import React, { useMemo } from "react";
import { Button } from "reactstrap";
import { GameModes, availableGameModes } from "./App";

interface Props {
    setGameMode: (gameMode: GameModes) => void
}

const MainMenu: React.FC<Props> = ({ setGameMode }) => {
    let gameModeButtons = useMemo(() => {
        return Object.entries(availableGameModes).map(
            ([gameModeName]) =>
                <Button
                    key={gameModeName}
                    color="primary"
                    onClick={() => setGameMode(gameModeName as GameModes)}
                >
                    {gameModeName}
                </Button>
        )
    }, [setGameMode]);

    return <div className="main-menu">
        <h1 className="header">
            Piano Tiles online
        </h1>
        <span className="text-muted font-italic">Select Game Mode:</span>
        {gameModeButtons}
    </div>
}

export default MainMenu;