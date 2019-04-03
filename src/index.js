import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'storm-react-diagrams/dist/style.min.css';
import './index.css';
import BodyWidget from './base-components/BodyWidget';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './redux/store';

// eslint-disable-next-line no-undef
const rootElement = document.getElementById('root');
// const markerHead = 'markerHead';
// const markerHeadInversed = 'markerHeadInversed';

const app = new App();
ReactDOM.render(
  <Provider store={store}>
    <BodyWidget app={app} />
  </Provider>,
  rootElement,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();