import { Button, Col, Row, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Item } from "./Item"

function MatchAlert({ matchResult, guesses }) {

    let message = '';
    let variant = '';
    let score = NaN;
    const navigate = useNavigate();

    matchResult["won"] ? (message = "YOU WON", variant = "success", score = matchResult["score"]) : (message = "YOU LOST", score = 0, variant = "warning");

    return (
        <Alert key={variant} variant={variant} className="position-fixed top-50 start-50 translate-middle match-alert border-5 px-4 py-2" style={{ zIndex: '9999' }}>
            <div className='p-0'>
                <Row><Col><Alert.Heading className="d-flex justify-content-center p-2" style={{ fontSize: 'xx-large' }}>{message}</Alert.Heading></Col></Row>
                <hr className='mt-0' />
                <Row className='flex-column'>
                    <Col className="d-flex justify-content-center" >
                        With {guesses} guesses, your Match Score is
                    </Col>
                    <Col className="d-flex justify-content-center" style={{ fontSize: 'xxx-large' }}>{score}</Col>
                </Row>
                <Row><Col>To see your total score go on your <Link to={'/history'} style={{ color: 'black' }}>history</Link> section.</Col></Row>


                {matchResult['secretItem'] ? <><hr /> <Row><Col className='d-flex align-items-center flex-column'><p>The secret item was</p> <Item item={matchResult['secretItem']} callback={null}></Item></Col></Row></> : []}

                <hr />
                <div className="d-flex justify-content-center p-1">
                    <Button onClick={() => navigate("/")} variant={variant}>
                        Go Home
                    </Button>
                </div>
            </div>
        </Alert>
    );
}


function GuessAlert({ guessed }) {
    let variant = '';
    let message = '';
    guessed ? (variant = "success", message = "You guessed right!") : (variant = "warning", message = "You guessed wrong!")

    return (
        <Alert variant={variant} className='shadow px-2 py-3 animation m-0 text-center' style={{ position: 'absolute', top: '10vh', width: '35rem' }}>
            <Alert.Heading className='m-0'>{message}</Alert.Heading>
        </Alert>
    );
}

export { MatchAlert, GuessAlert };