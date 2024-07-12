[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/-RTLSo1u)
# Exam #3: "Guess Who"

## Student: s317869 GRIECO EMILIO JOSEPH

# Server side

## API Server

- POST `/api/sessions`
  - Description: authenticate the user who is trying to login
  - Request body content: credentials of the user who is trying to login
  - Response body content: authenticated user
  
- GET `/api/sessions/current`
  - Description: check if current user is logged in and get her data
  - Request parameters: _None_
  - Response body content: authenticated user
- DELETE `/api/sessions/current`
  - Description: logout current user
  - Request body content: _None_
  - response body content: _None_
- GET `/api/items/:difficulty`
  - Description: Get N different random items, where N is the _difficulty_ parameter
  - Request parameters: game _difficulty_ (12, 24, 36)
  - Response body content: Array of objects, each describing one item

- POST `/api/item`
  - Description: Among the list of items passed as body content it selects a random item as secret item
  - Request body content: the list of items obtained through the GET `/api/items` api
  - Response body content: info message

- GET `/api/item`
  - Description: Get the secret item
  - Request parameters: _None_
  - Response body content: secret item

- GET `/api/item/:name`
  - Description: compares the guessed item's name with the secret item's name
  - Request parameters: _name_ of the item that the user guessed
  - Response body content: true if the user guessed, false otherwise

- GET `/api/item/:property/:value`
  - Description: compares the guessed property's value with the secret item's property value
that the user is trying to guess
  - Response body content: true if the user guessed, false otherwise

- POST `/api/history/store`
  - Description: stores the match info once it is finished
  - Request body content: date, difficulty, secretItem, score and won match's info
  - Response body content: info message

- GET `/api/history/get`
  - Description: Get all the matches played by the logged in user
  - Request parameters: user's info
  - Response body content: Array of objects, each describing one match

## Database Tables

- Table `users` - contains id email name hash salt
- Table `items` - contains id name race transformation hair eyes aura gender
- Table `histories` - contains id date difficulty item score won user

# Client side


## React Client Application Routes

- Route `/`: loads the homepage with the menu where the user can select a game difficulty and start a match
- Route `/match`: loads the matchpage where the user plays the game
- Route `/login`: loads the loginpage where the user can insert its credentials and authenticate herself
- Route `/history`: loads the historypage if the user is currently logged in. Here are displayed all the mathes played by the user
- Route `*`: loads the notfoundpage. Indicates to the user that is using a wrong route and should return to the homepage


## Main React Components

- `PageLayouts` (in `PageLayout.js`): This component exports all the different pages of the application, including the HomePage, MatchPage, HistoryPage, and LoginPage
- `Navbar` (in `Navigation.js`): This component is the application navbar, present on all pages, and allows the user to return to the homepage, move to the login page, logout, or move to the history page
- `Catalog` (in `Catalog.js`): This component renders all the items for the match
- `GuessModal` (in `GuessModal.js`): This component allows the user to guess the value of a property during the match
- `HistoryTable` (in `HistoryTable.js`): This component renders all the history of the user

# Usage info
```
cd server
node index.js
cd ..
cd client
npm run dev
```
open your browser on `http://localhost:5173/`

## Example Screenshot

![Screenshot](/client/public/images/screenshot1.png)
![Screenshot](/client/public/images/screenshot2.png)

## Users Credentials

- user1@polito.it, password1 (already played some games)
- user2@polito.it, password2 (already played some games)
- user3@polito.it, password3 (never played a game)
