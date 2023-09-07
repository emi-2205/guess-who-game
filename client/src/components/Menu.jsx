import { DifficultySelector } from "./SelectorLayout";
import { StartButton } from "./ButtonLayout";
import Row from 'react-bootstrap/Row';

const Menu = (props) => {

    return (
        <div className="menu shadow">
            <Row>
                <DifficultySelector setDifficulty={props.setDifficulty}></DifficultySelector>
                <StartButton play={props.play}></StartButton>
            </Row>
        </div>
    );
}

export { Menu };