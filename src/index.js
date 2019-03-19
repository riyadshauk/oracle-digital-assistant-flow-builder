// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'storm-react-diagrams/dist/style.min.css';
import BodyWidget from './components/BodyWidget';
import App from './App';
import * as serviceWorker from './serviceWorker';

const app = new App();
// eslint-disable-next-line no-undef
ReactDOM.render(<BodyWidget app={app} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();