// @flow
import {
  // eslint-disable-next-line max-len
  ADD_STATE, ADD_CONTEXT_VARIABLE, ADD_PLATFORM, ADD_NAME, ADD_VARIABLE, ADD_ACTION, ADD_TRANSITION,
  // eslint-disable-next-line max-len
  RENAME_STATE, RENAME_CONTEXT_VARIABLE, RENAME_PLATFORM, RENAME_NAME, RENAME_VARIABLE_VALUE,
  // eslint-disable-next-line max-len
  REMOVE_STATE, REMOVE_CONTEXT_VARIABLE, REMOVE_PLATFORM, REMOVE_NAME, REMOVE_VARIABLE, REMOVE_ACTION,
  // eslint-disable-next-line max-len
  GET_STATE_NAME,
  UPDATE_COMPONENT_TYPE,
} from './actionTypes';
import {
  type State, type Variable,
} from './representationTypes';
import { string } from 'postcss-selector-parser';

export const addState = (state: State, name: string, id: string) => {
  return {
    type: ADD_STATE,
    payload: { state, name, id },
  };
};
export const addContextVariable = (variable: Variable) => ({
  type: ADD_CONTEXT_VARIABLE,
  payload: { variable },
});
export const addPlatform = (platformVersion: string) => ({
  type: ADD_PLATFORM,
  payload: { platformVersion },
});
export const addName = (botName: string) => ({
  type: ADD_NAME,
  payload: { botName },
});
export const addVariable = (param: { [key: string | number]: any }) => ({
  type: ADD_VARIABLE,
  payload: { param },
});
export const addAction = (payload: {
  sourceID: number,
  targetID: number,
  sourceActionName: string,
  targetLabelName: string,
}) => ({
  type: ADD_ACTION,
  payload,
});
export const addTransition = (payload: {
  sourceID: number,
  targetID: number,
}) => ({
  type: ADD_TRANSITION,
  payload,
});

export const renameState = (payload: {
  oldName: string,
  newName: string,
}) => ({
  type: RENAME_STATE,
  payload,
});
export const renameContextVariable = (
  { prev, cur }: { prev: Variable, cur: Variable },
) => ({
  type: RENAME_CONTEXT_VARIABLE,
  payload: { prev, cur },
});
export const renameVariableValue = (
  { variableName, newValue, stateName }: {
    variableName: string, newValue: string, stateName: string,
  },
) => ({
  type: RENAME_VARIABLE_VALUE,
  payload: { variableName, newValue, stateName },
});

export const removeState = (id: string) => ({
  type: REMOVE_STATE,
  payload: { id },
});
export const removeContextVariable = (variable: Variable) => ({
  type: REMOVE_CONTEXT_VARIABLE,
  payload: { variable },
});
export const removeAction = (sourceID: string, targetID: string) => ({
  type: REMOVE_ACTION,
  payload: { sourceID, targetID },
});
export const removeTransition = (sourceID: string, targetID: string) => ({
  type: REMOVE_ACTION, // removing a transition is the same logic as removing an action
  payload: { sourceID, targetID },
});

export const updateComponent = (payload: { stateName: string, componentType: string }) => ({
  type: UPDATE_COMPONENT_TYPE,
  payload,
});