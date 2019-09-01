/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import * as actionCreators from './actions/representation';

/**
 * @see https://react-redux.js.org/introduction/basic-tutorial for a complete example codebase (todo-list)
 */

// export default createStore(
//   rootReducer,
//   // https://github.com/zalmoxisus/redux-devtools-extension#usage
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
// );

// https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Features/Trace.md
// https://github.com/zalmoxisus/redux-devtools-extension/blob/master/examples/counter/store/configureStore.js
const composeEnhancers = composeWithDevTools({ actionCreators, trace: true });
export default createStore(
  rootReducer,
  composeEnhancers(),
);