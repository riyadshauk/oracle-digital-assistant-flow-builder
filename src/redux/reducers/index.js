import { combineReducers } from 'redux';
import representation from './representation';
import diagramMapping from './diagramMapping';

// export default combineReducers({
//   diagramMapping,
//   representation,
// });

const appReducer = combineReducers({
  diagramMapping,
  representation,
});

/**
 * This would be called rootReducer.
 * This conveniently resets the state of all reducers.
 * @see https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store
 */
export default (state, action) => {
  if (action.type === 'RESET_STATE') {
    // eslint-disable-next-line no-param-reassign
    state = undefined;
  }
  return appReducer(state, action);
};