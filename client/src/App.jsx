/*
 * [2022/2023]
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Guess WHO Project
 * Author: Emilio Joseph Grieco
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { React, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap/'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage, MatchPage, NotFoundLayout, LoginPage, HistoryPage } from './components/PageLayout';
import ReactHowler from 'react-howler'
import API from '../src/API';

function App() {

  const [difficulty, setDifficulty] = useState(24);
  const siglaURL = '/sigla.mp3';
  const [isPlaying, setIsPlaying] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);


  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      throw err;
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setUser(null);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const userr = await API.getUserInfo();  // here you have the user info, if already logged in
        setUser(userr);
        setLoggedIn(true);
      } catch (err) {
        setUser(null);
        setLoggedIn(false);
      }
    };
    init();
  }, []);  // This useEffect is called only the first time the component is mounted.

  return (
    <BrowserRouter>
      <Container fluid className="App no-borders p-0">

        <Navigation logout={handleLogout} user={user} loggedIn={loggedIn} />

        <Routes>
          <Route path="/" element={<HomePage setDifficulty={setDifficulty} play={handlePlay} />} />
          <Route path="/match" element={<MatchPage difficulty={difficulty} user={user} />} />
          <Route path="/login" element={!loggedIn ? <LoginPage login={handleLogin} /> : <Navigate replace to='/' />} />
          <Route path="/history" element={(loggedIn && user) ? <HistoryPage user={user} /> : <Navigate replace to='/login' />} />
          <Route path="*" element={<NotFoundLayout />} />
        </Routes>

        {isPlaying ? <ReactHowler
          src={siglaURL}
          playing={isPlaying}
          volume={0.05}
          loop={true}
        /> : []}

      </Container>
    </BrowserRouter>

  );

}

export default App;
