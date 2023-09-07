import { Button } from 'react-bootstrap';
import { GuessModal } from './GuessModal';
import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GuessButton(props) {

    const [modalShow, setModalShow] = useState(false);

    const handleSubmit = () => {
        setModalShow(false);
    };

    return (
        <div className='m-3 guess-container d-flex justify-content-center shadow'>
            <Button className='guess-button d-flex justify-content-center m-2' size='lg' disabled={props.disabled} variant="primary" onClick={() => setModalShow(true)}>Guess!</Button>
            <GuessModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                handlepropertyguess={props.handlePropertyGuess}
                handlesubmit={handleSubmit}
                itemlist={props.itemlist}
            />
        </div>
    );
}

function StartButton(props) {
    const navigate = useNavigate();
    return (
        <Button onClick={() => navigate("/match", props.play())} className='start-button guess-button py-3 shadow'>Start the game!</Button>
    );
}

export { GuessButton, StartButton }; 
