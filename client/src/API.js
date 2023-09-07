'use strict';

const SERVER_URL = 'http://localhost:3001/api/';

/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
          // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
          response.json()
            .then(json => resolve(json))
            .catch(err => reject({ error: "Cannot parse server response" }))
        } else {
          // analyzing the cause of error
          response.json()
            .then(obj =>
              reject(obj)
            ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err =>
        reject({ error: "Cannot communicate" })
      ) // connection error
  });
}

//! Items
const getItems = async (difficulty) => {
  return getJson(
    fetch(SERVER_URL + 'items/' + difficulty)
  ).then(json => {
    return json.map((item) => {
      const clientItem = {
        id: item.id,
        name: item.name,
        properties: { race: item.race, transformation: item.transformation, gender: item.gender, hair: item.hair, eyes: item.eyes, aura: item.aura }
      }
      return clientItem;
    })
  })
}

const chooseSecretItem = async (itemList) => {
  return getJson(
    fetch(SERVER_URL + "item", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemList })
    })
  )
    .then(response => { return response })
    .catch(error => {
      console.error('Error choosing secret item:', error);
      throw error;
    });
}

const getSecretItem = async () => {
  return getJson(
    fetch(SERVER_URL + 'item/')
  ).then((response) => { return response })
}

const itemGuess = async (name) => {
  return getJson(
    fetch(SERVER_URL + 'item/' + name)
  ).then((response) => { return response })
}

const propertyGuess = async (property, value) => {
  return getJson(
    fetch(`${SERVER_URL}item/${property}/${value}`)
  ).then((response) => { return response })
}

//! History
const newHistory = async (matchResult) => {
  return getJson(
    fetch(SERVER_URL + "history/store", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ matchResult })
    })
  )
    .then(response => { return response })
    .catch(error => {
      console.error('Error storing the history', error);
      throw error;
    });
}

const getUserHistory = async () => {
  return getJson(
    fetch(SERVER_URL + "history/get", {
      credentials: 'include'
    })
  ).then((response) => { return response })
}

//! Auth
const logIn = async (credentials) => {
  return getJson(fetch(SERVER_URL + 'sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    body: JSON.stringify(credentials),
  })
  )
};

const getUserInfo = async () => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    // this parameter specifies that authentication cookie must be forwared
    credentials: 'include'
  })
  )
};

const logOut = async () => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    method: 'DELETE',
    credentials: 'include'  // this parameter specifies that authentication cookie must be forwared
  })
  )
}

const API = { getItems, chooseSecretItem, itemGuess, propertyGuess, logIn, getUserInfo, logOut, newHistory, getUserHistory, getSecretItem };
export default API;
