// @flow
import {
  // eslint-disable-next-line max-len
  ADD_STATE, ADD_CONTEXT_VARIABLE, ADD_PLATFORM, ADD_NAME, ADD_VARIABLE, ADD_ACTION, ADD_TRANSITION, ADD_TRANSITION_PROPERTY, ADD_ACTION_PROPERTY, ADD_PARAMETER, ADD_PROPERTY,
  // eslint-disable-next-line max-len
  RENAME_STATE, RENAME_CONTEXT_VARIABLE, RENAME_PLATFORM, RENAME_NAME, RENAME_VARIABLE_VALUE, RENAME_TRANSITION_PROPERTY, RENAME_ACTION_PROPERTY, RENAME_PARAMETER, RENAME_PROPERTY_VALUE,
  // eslint-disable-next-line max-len
  REMOVE_STATE, REMOVE_CONTEXT_VARIABLE, REMOVE_PLATFORM, REMOVE_NAME, REMOVE_VARIABLE, REMOVE_ACTION, REMOVE_TRANSITION, REMOVE_TRANSITION_PROPERTY, REMOVE_ACTION_PROPERTY, REMOVE_PARAMETER, REMOVE_PROPERTY,
  // eslint-disable-next-line max-len
  GET_STATE_NAME, UPDATE_PROPERTY,
  UPDATE_COMPONENT_TYPE,
  ADD_SYSTEM_VARIABLE,
  RENAME_SYSTEM_VARIABLE,
  REMOVE_SYSTEM_VARIABLE,
  MAP_NAME_TO_ID,
  RESET_REPRESENTATION,
} from '../actionTypes/representation';
import {
  type State, type Variable,
} from '../reducerTypes/representation';

export const addState = (state: State, name: string, id: string) => {
  return {
    type: ADD_STATE,
    payload: {
      state, name, id,
    },
  };
};
export const addContextVariable = (variable: Variable) => {
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
export const addVariable = (param: { [name: string | number]: any }) => ({
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
export const addProperty = (payload: {
  stateName: string,
  propertyKey: string,
  componentPropertyType: string,
  propertyValue?: string,
  path?: [string],
  portID?: string,
}) => ({
  type: ADD_PROPERTY,
  payload,
});
export const addParameter = (variable: Variable) => ({
  type: ADD_PARAMETER,
  payload: { variable },
});
export const addSystemVariable = (variable: Variable) => ({
  type: ADD_SYSTEM_VARIABLE,
  payload: { variable },
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
export const renamePropertyValue = (payload: {
  propertyName: string,
  newValue: string,
  stateName: string,
  portID?: string,
}) => ({
  type: RENAME_PROPERTY_VALUE,
  payload,
});
export const renameParameter = (
  { prev, cur }: { prev: Variable, cur: Variable },
) => ({
  type: RENAME_PARAMETER,
  payload: { prev, cur },
});
export const renameSystemVariable = (
  { prev, cur }: { prev: Variable, cur: Variable },
) => ({
  type: RENAME_SYSTEM_VARIABLE,
  payload: { prev, cur },
});

export const removeState = (id: string) => ({
  type: REMOVE_STATE,
  payload: { id },
});
export const removeContextVariable = (variable: Variable) => ({
  type: REMOVE_CONTEXT_VARIABLE,
  payload: { variable },
});
/**
 * @deprecated This shouldn't be used. See removeTransition.
 */
export const removeAction = (sourceID: string, targetID: string) => ({
  type: REMOVE_ACTION,
  payload: { sourceID, targetID },
});
export const removeTransition = (payload: {
  sourcePortParentID: string,
  sourcePortLabel: string,
  targetPortLabel: string,
  targetPortParentID: string,
}) => ({
  type: REMOVE_TRANSITION,
  payload,
});
export const removeProperty = (node: NodeModel, propertyName: string, portID: PortModel) => ({
  type: REMOVE_PROPERTY,
  payload: { node, propertyName, portID },
});
export const removeParameter = (propertyName: string) => ({
  type: REMOVE_PARAMETER,
  payload: { propertyName },
});
export const removeSystemVariable = (propertyName: string) => ({
  type: REMOVE_SYSTEM_VARIABLE,
  payload: { propertyName },
});

export const updateComponent = (payload: { stateName: string, componentType: string }) => ({
  type: UPDATE_COMPONENT_TYPE,
  payload,
});
export const updateProperty = (payload: {
  stateName: string,
  propertyKey: string,
  componentPropertyType: string,
}) => ({
  type: UPDATE_PROPERTY,
  payload,
});

export const mapNameToID = (node: NodeModel) => ({
  type: MAP_NAME_TO_ID,
  payload: { node },
});

export const resetRepresentation = () => ({
  type: RESET_REPRESENTATION,
});