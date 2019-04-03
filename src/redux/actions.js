// @flow
import {
  ADD_STATE, ADD_CONTEXT_VARIABLE, ADD_PLATFORM, ADD_NAME, ADD_PARAMETER,
  RENAME_STATE, RENAME_CONTEXT_VARIABLE, RENAME_PLATFORM, RENAME_NAME, RENAME_PARAMETER,
  REMOVE_STATE, REMOVE_CONTEXT_VARIABLE, REMOVE_PLATFORM, REMOVE_NAME, REMOVE_PARAMETER,
} from './actionTypes';
import {
  type State, type ContextVariable,
} from './representationTypes';

export const addState = (state: State) => ({
  type: ADD_STATE,
  payload: { state },
});
export const addContextVariable = (variable: ContextVariable) => {
  console.log('addContextVariable variable:', variable);
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