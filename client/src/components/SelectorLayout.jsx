import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { ButtonGroup, ToggleButton, OverlayTrigger, Tooltip } from 'react-bootstrap';

function DifficultySelector(props) {
    const [radioValue, setRadioValue] = useState(24);
    const renderTooltip = (props) => (
        <Tooltip id="tooltip left" {...props} className='me-2' >
            Choose Your Game Difficulty! Select from Easy, Medium, or Hard, Each Corresponding to Different Item Counts: 12, 24, or 36. Once You've Chosen, Proceed with the Game by Pressing 'Start the game!'
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement="left"
            delay={{ show: 400, hide: 120 }}
            overlay={renderTooltip}
            style={{ backgroundColor: 'white', color: 'black' }}
        >
            <ButtonGroup className='p-0 pt-0 mb-4 shadow' variant="secondary">
                <ToggleButton key={1} type="radio" className={`btn ${radioValue === 12 ? 'btn-outline-danger' : 'difficulty-button'}`}
                    variant={`${radioValue === 12 ? 'outline-danger' : 'primary-light'}`} value={12}
                    checked={radioValue == 12} onClick={() => { props.setDifficulty(12); setRadioValue(12) }}>Easy</ToggleButton>
                <ToggleButton key={2} type="radio" className={`btn ${radioValue === 24 ? 'btn-outline-danger' : 'difficulty-button'}`}
                    variant={`${radioValue === 24 ? 'outline-danger' : 'primary-light'}`} value={24}
                    checked={radioValue == 24} onClick={(e) => { props.setDifficulty(24); setRadioValue(24) }}>Medium</ToggleButton>
                <ToggleButton key={3} type="radio" className={`btn ${radioValue === 36 ? 'btn-outline-danger' : 'difficulty-button'}`}
                    variant={`${radioValue === 36 ? 'outline-danger' : 'primary-light'}`} value={36}
                    checked={radioValue == 36} onClick={(e) => { props.setDifficulty(36); setRadioValue(36) }}>Hard</ToggleButton>
            </ButtonGroup>
        </OverlayTrigger>
    );
}

function GuessSelector({ text, selectedValue, onChange, disabled, options }) {
    useEffect(() => {
        selectedValue ? selectedValue = "" : [];
    }, []);

    return (
        <Form.Select className='m-3' aria-label="Default select example" value={selectedValue || ""} onChange={onChange} disabled={disabled}>
            <option value="" disabled>-- {text} --</option>
            {options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
            ))}
        </Form.Select>
    );
}

export { DifficultySelector, GuessSelector };