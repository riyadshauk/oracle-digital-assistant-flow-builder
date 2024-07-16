# Flow Builder for the Oracle Digital Assistant

## Demo

<img src="240716 Digital Assistant Flow Builder Demo.gif" alt="Digital Assistant Flow Builder Demo GIF" />

## Install & Run

As usual, to install deps into node_modules and run a local server on http://localhost:3000, run the following:

```bash
yarn && yarn start
```

## Tech used

I build this project in 2019 while working with the Oracle Digital Assistant.

It uses [React](https://react.dev/) and [Redux](https://redux.js.org/). For type-checking, I used [Flow](https://flow.org/) (which is similar to [TypeScript](https://www.typescriptlang.org/)). For code-style, I used [ESLint](https://eslint.org/). I also used a couple handy libraries for the [drag-and-drop UML-like functionality](https://github.com/projectstorm/react-diagrams), as well as for the YAML [syntax-highlighting](https://github.com/codemirror/basic-setup).

As of 2024, I spent part of a day to update the dependencies here, so that it simply installs and runs.

## About

This project aimed to deliver a graphic, drag-and-drop-based designer (kind of like a flow-diagram) for creating the YAML definition for the Flow of an Oracle Digital Assistant.

It's in the form of a [web-app that can be run in a browser](https://riyadshauk.com/digital-assistant/).
