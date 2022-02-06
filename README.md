# react-use-blackjack

# Motivation

When tasked with creating a Black Jack game, I found that much of the functionality could be sbstrated into custom hooks. When i moved all of the fuinctionality into hooks i realised that the application consuming the hook was not the focus of this project but rather the hook. The hook was refined and tested with all projected functionality that any consumer could need. 

## Features

* Built to abstract game logic for a black jack game useBlackJack
* Deck (useDeck) and player (usePlayer) management are abstracted to provide flexibility if you want to change the game
  logic
* Functional programming with modern react hooks
* Full text coverage (not including the example app)

## Available Scripts

In the project directory, you can run:

### `npm start` or `yarn start`

Runs the example app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test` or `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.
