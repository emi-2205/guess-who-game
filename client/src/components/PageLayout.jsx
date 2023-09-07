import { React, useState, useEffect } from 'react';
import { Button, Spinner, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Menu } from "./Menu"
import { GuessButton } from './ButtonLayout';
import { Catalog } from './Catalog';
import { MatchAlert, GuessAlert } from './AlertLayout';
import { HistoryTable } from './HistoryTable';
import API from '../API';
import dayjs from 'dayjs';
import { LoginForm } from './Auth';


function HomePage(props) {

  useEffect(() => {
    props.setDifficulty(24);
  }, []);

  return (
    <Container fluid id='home-page' className="d-flex align-items-center flex-column justify-content-center">
      <Menu setDifficulty={props.setDifficulty} play={props.play} volume={props.volume} />
    </Container>
  );
}

function MatchPage(props) {
  //lista con i personaggi della partita
  const [matchItemList, setMatchItemList] = useState([]);
  const [guesses, setGuesses] = useState(0);
  const [matchAlertShow, setMatchAlertShow] = useState(false);
  const [guessAlertShow, setGuessAlertShow] = useState(false);
  const [ready, setReady] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [guessResult, setGuessResult] = useState(false);

  useEffect(() => {
    props.difficulty ? ((
      API.getItems(props.difficulty)
        .then(items => {
          setMatchItemList(items);
          API.chooseSecretItem(items)
            .then((response) => {
              setReady(true);
            })
            .catch(e => {
              console.log("Error choosing the secret item", e);
            })
        })
        .catch(e => {
          console.log("Error getting the list of items for the match", e);
        }))) : []

  }, [props.difficulty]);

  // logica dei guesses
  const handlePropertyGuess = (property, value) => {
    API.propertyGuess(property, value)
      .then((guessed) => {
        setGuesses((guesses) => (guesses + 1));
        guessed ? setMatchItemList(matchItemList.filter(item => item.properties[property] === value)) : setMatchItemList(matchItemList.filter(item => item.properties[property] !== value));
        setGuessAlertShow(true);
        const timeout = setTimeout(() => {
          setGuessAlertShow(false);
        }, 3000); // Adjust the duration in milliseconds (e.g., 5000 ms = 5 seconds)
        setGuessResult(guessed);
        return () => {
          clearTimeout(timeout);
        };
      })
      .catch(e => { console.log("Error during the property guess operation", e); });
  };

  // click di un item
  const handleItemGuess = async (item) => {
    const today = dayjs().format('YYYY-MM-DD HH:mm:ss'); let secretItem = null; let score = 0; let won = 0;
    const guessed = await API.itemGuess(item.name);

    if (guessed) {
      secretItem = item; score = Math.max(props.difficulty - guesses, 0); won = 1;
    } else {
      const result = await API.getSecretItem();
      secretItem = result;
    }
    setMatchResult({ 'date': today, 'difficulty': props.difficulty, 'secretItem': secretItem, 'score': score, 'won': won });
  }

  useEffect(() => {
    if (props.user && props.user.id && matchResult) {
      API.newHistory(matchResult)
        .then((result) => { })
        .catch((e) => { console.log("Error storing the history", e); });
    }
    matchResult ? setMatchAlertShow(true) : [];
  }, [matchResult]);

  return (
    <Container fluid id='match-page' className="vh-100 d-flex align-items-center flex-column justify-content-center no-borders">
      {(matchItemList.length && ready) ? <Catalog itemList={matchItemList} callback={handleItemGuess} /> : <Spinner animation="border" variant="dark" />}
      {(matchItemList.length && ready) ? <GuessButton disabled={matchAlertShow} handlePropertyGuess={handlePropertyGuess} itemlist={matchItemList} /> : []}
      {(matchAlertShow && ready && matchResult) && <MatchAlert matchResult={matchResult} guesses={guesses} user={props.user} />}
      {(guessAlertShow && ready) && <GuessAlert guessed={guessResult} />}
    </Container>
  );
}

function HistoryPage(props) {
  const [history, setHistory] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    API.getUserHistory()
      .then((result) => {
        setHistory(result);
        const totalSum = result.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.score;
        }, 0);
        setTotalScore(totalSum);
      })
      .catch((e) => { console.log("Error displaying user history", e); })
  }, []);

  return (
    history ? (<Container fluid id='history-page' className="d-flex align-items-center flex-column justify-content-center">
      <div className='history-menu shadow p-4'>
        <h1 className='p-4 pb-1 mb-0'>{props.user.name}'s History</h1>
        <HistoryTable user={props.user} history={history}></HistoryTable>
        <div className='d-flex flex-column justify-content-center align-items-center'>
          <h3 className='pt-4'>Your total score is</h3>
          <h1>{totalScore}</h1>
        </div>
      </div>
    </Container>) : <Spinner animation="border" variant="dark" />
  );
}

function LoginPage(props) {
  return (
    props.login ? (<Container fluid id='history-page' className="d-flex align-items-center flex-column justify-content-center">
      <div className='history-menu shadow p-4'>
        <LoginForm login={props.login} />
      </div>
    </Container>) : <Spinner animation="border" variant="dark" />
  );
}

function NotFoundLayout() {
  return (
    <Container id="not-found-page" fluid className="vh-100 d-flex align-items-center flex-column justify-content-center">
      <h2>This is not the route you are looking for!</h2>
      <Link to="/">
        <Button variant="primary" className='guess-button'>Go Home!</Button>
      </Link>
    </Container>
  );
}

export { HomePage, MatchPage, NotFoundLayout, LoginPage, HistoryPage }; 
