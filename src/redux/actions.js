// @flow
import {
  // eslint-disable-next-line max-len
  ADD_STATE, ADD_CONTEXT_VARIABLE, ADD_PLATFORM, ADD_NAME, ADD_PARAMETER, ADD_TRANSITION,
  // eslint-disable-next-line max-len
  RENAME_STATE, RENAME_CONTEXT_VARIABLE, RENAME_PLATFORM, RENAME_NAME, RENAME_PARAMETER,
  // eslint-disable-next-line max-len
  REMOVE_STATE, REMOVE_CONTEXT_VARIABLE, REMOVE_PLATFORM, REMOVE_NAME, REMOVE_PARAMETER, REMOVE_TRANSITION,
} from './actionTypes';
import {
  type State, type ContextVariable,
} from './representationTypes';

export const addState = (state: State, name: string, id: string) => {
  console.log('addState invoked with state:', state);
  return {
    type: ADD_STATE,
    payload: { state, name, id },
  };
};
export const addContextVariable = (variable: ContextVariable) => {
  console.log('addContextVariable invoked, variable:', variable);
  return {
    type: ADD_CONTEXT_VARIABLE,
    payload: { variable },
  };
};
export const addPlatform = (platformVersion: string) => ({
  type: ADD_PLATFORM,
  payload: { platformVersion },
});
export const addName = (botName: string) => ({
  type: ADD_NAME,
  payload: { botName },
});
export const addParameter = (param: { [key: string | number]: any }) => ({
  type: ADD_PARAMETER,
  payload: { param },
});
export const addTransition = (payload: { sourceID: number, targetID: number }) => ({
  type: ADD_TRANSITION,
  payload,
});


export const renameContextVariable = (
  { prev, cur }: { prev: ContextVariable, cur: ContextVariable },
) => {
  console.log('renameContextVariable invoked, cur:', cur);
  return {
    type: RENAME_CONTEXT_VARIABLE,
    payload: { prev, cur },
  };
};


export const removeContextVariable = (variable: ContextVariable) => {
  console.log('removeContextVariable invoked, variable:', variable);
  return {
    type: REMOVE_CONTEXT_VARIABLE,
    payload: { variable },
  };
};
/**
 * @todo use this action when removing links on the diagram (to map diagram link
 * to transition in resulting Flow representation)
 */
export const removeTransition = (sourceState: State, targetState: State) => ({
  type: REMOVE_TRANSITION,
  payload: { sourceState, targetState },
});
