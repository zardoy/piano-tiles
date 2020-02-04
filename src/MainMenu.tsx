import React, { useMemo } from "react";
import { Button } from "reactstrap";
import { GameModes, availableGameModes } from "./App";

interface Props {
    setGameMode: (gameMode: GameModes) => void
}

const MainMenu: React.FC<Props> = ({ setGameMode }) => {
    let gameModeButtons = useMemo(() => {
        return Object.entries(availableGameModes).map(([gameModeName]) => <Button key={gameModeName} onClick={() => setGameMode(gameModeName as GameModes)}>{gameModeName}</Button>)
    }, [setGameMode]);

    return <div className="bg-white d-flex justify-content-center flex-column">
        <span>Choose mode: </span>
        {gameModeButtons}
    </div>
}

export default MainMenu;