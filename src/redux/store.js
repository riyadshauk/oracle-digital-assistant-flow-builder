import { createStore } from 'redux';
import rootReducer from './reducers';

/**
 * @see https://react-redux.js.org/introduction/basic-tutorial for a complete example codebase (todo-list)
 */

export default createStore(rootReducer);