// @flow
import { dump } from 'js-yaml';
import {
  // eslint-disable-next-line max-len
  ADD_STATE, ADD_CONTEXT_VARIABLE, ADD_PLATFORM, ADD_NAME, ADD_VARIABLE, ADD_ACTION, ADD_TRANSITION,
  // eslint-disable-next-line max-len
  RENAME_STATE, RENAME_CONTEXT_VARIABLE, RENAME_PLATFORM, RENAME_NAME, RENAME_VARIABLE_VALUE,
  // eslint-disable-next-line max-len
  REMOVE_STATE, REMOVE_CONTEXT_VARIABLE, REMOVE_PLATFORM, REMOVE_NAME, REMOVE_VARIABLE, REMOVE_ACTION,
  UPDATE_COMPONENT_TYPE,
} from '../actionTypes';
import {
  type State, type Variable, type RepresentationStore,
} from '../representationTypes';

const initialStore = {
  representation: {
    metadata: {
      platformVersion: '1.0',
    },
    main: true,
    name: 'defaultName',
    parameters: {},
    context: {
      variables: {},
    },
    states: {},
  },
  idToName: {},
  stateNameToCount: {},
};

const generateNextStateNameCount = (store: RepresentationStore, stateName: string) => {
  if (Object.prototype.hasOwnProperty.call(store.stateNameToCount, [stateName])) {
    let count = store.stateNameToCount[stateName];
    let proposedName = stateName + count;
    while (Object.prototype.hasOwnProperty.call(store.representation.states, proposedName)) {
      count += 1;
      proposedName = stateName + count;
    }
    store.stateNameToCount[stateName] = count;
  } else {
    store.stateNameToCount[stateName] = 1;
  }
  return store.stateNameToCount[stateName];
};

export default (store: RepresentationStore = initialStore,
  action: { type: string, payload: { [key: string]: any } }) => {
  console.log('bot yaml:\n\n', dump(store));
  switch (action.type) {
    case ADD_STATE: {
      const { state } = action.payload;
      const stateName: string = action.payload.name;
      const stateId: string = action.payload.id;
      const nextStore = { ...store };
      const count = generateNextStateNameCount(store, stateName);
      store.idToName[stateId] = stateName + count;
      nextStore.representation.states[
        store.idToName[stateId]
      ] = state;
      return nextStore;
    }
    case ADD_CONTEXT_VARIABLE: {
      const { variable } = action.payload;
      const { name, value } = (variable: Variable);
      return {
        ...store,
        representation: {
          ...store.representation,
          context: {
            variables: {
              ...store.representation.context.variables,
              ...{ [name]: value },
            },
          },
        },
      };
    }
    case ADD_PLATFORM: {
      const { platformVersion } = action.payload;
      return {
        ...store,
        representation: {
          ...store.representation,
          metadata: { platformVersion },
        },
      };
    }
    case ADD_NAME: {
      const { botName } = action.payload;
      return {
        ...store,
        representation: {
          ...store.representation,
          name: botName,
        },
      };
    }
    case ADD_VARIABLE: {
      const { param } = action.payload;
      return {
        ...store,
        representation: {
          ...store.representation,
          parameters: {
            ...store.representation.parameters,
            ...param,
          },
        },
      };
    }
    case ADD_ACTION: {
      let {
        sourceID,
        targetID,
        sourceActionName,
        targetLabelName,
      } = action.payload;
      const nextStore = { ...store };
      let sourceState: State = nextStore.representation.states[nextStore.idToName[sourceID]];
      if (sourceState === undefined) {
        [sourceID, targetID] = [targetID, sourceID];
        [sourceActionName, targetLabelName] = [targetLabelName, sourceActionName];
        sourceState = nextStore.representation.states[nextStore.idToName[sourceID]];
      }
      let actualActionName = sourceActionName;
      switch (sourceState.component) {
        case 'System.ConditionExists':
          if (sourceActionName === 'true') {
            actualActionName = 'exists';
          } else if (sourceActionName === 'false') {
            actualActionName = 'notexists';
          }
          break;
        case 'System.ConditionEquals':
          if (sourceActionName === 'true') {
            actualActionName = 'equal';
          } else if (sourceActionName === 'false') {
            actualActionName = 'notequal';
          }
          break;
        default:
          break;
      }

      // @todo handle this before it gets to redux?
      if (sourceActionName === 'variable') {
        // handle case for linking to context variable
        if (targetID !== undefined
          && targetID
          && nextStore.representation.states[nextStore.idToName[targetID]] === undefined) {
          sourceState.properties.variable = targetLabelName;
        } // otherwise 'variable' attempted to link to a non-context variable, so do nothing
        return nextStore;
      }
      sourceState.transitions.actions[actualActionName] = nextStore.idToName[targetID];
      return nextStore;
    }
    case ADD_TRANSITION: {
      const {
        sourceID,
        targetID,
      } = action.payload;
      const nextStore = { ...store };
      const sourceState: State = nextStore.representation.states[nextStore.idToName[sourceID]];
      sourceState.transitions.next = nextStore.idToName[targetID];
      return nextStore;
    }
    case RENAME_STATE: {
      const nextStore = { ...store };
      const { oldName, newName } = action.payload;
      const state = { ...nextStore.representation.states[oldName] };
      // disallow duplicate state names
      if (Object.prototype.hasOwnProperty.call(nextStore.representation.states, newName)) {
        return nextStore;
      }
      // update state name in idToName
      Object.entries(nextStore.idToName).forEach((entry) => {
        const id = entry[0];
        const name = entry[1];
        if (name === oldName) {
          nextStore.idToName[id] = newName;
        }
      });
      delete nextStore.representation.states[oldName];
      nextStore.representation.states[newName] = state;
      return nextStore;
    }
    case RENAME_CONTEXT_VARIABLE: {
      const { prev, cur } = action.payload;
      const nextStore = { ...store };
      delete nextStore.representation.context.variables[prev.name];
      // disallow duplicate context-variable names
      if (Object.prototype.hasOwnProperty.call(nextStore.representation.context.variables, cur)) {
        return nextStore;
      }
      nextStore.representation.context.variables[cur.name] = cur.value;
      // fix transitions in store (variable values in states) related to changing the variable name
      Object.values(nextStore.representation.states).forEach((state) => {
        // eslint-disable-next-line max-len
        // $FlowFixMe: Cannot call `Object.values(...).forEach` with function bound to `callbackfn` because property `properties` is missing in mixed [1] in the first argument.
        const { properties } = state;
        Object.keys(properties).forEach((property) => {
          if (property === 'variable'
            && properties[property] === prev.name) {
            properties[property] = cur.name;
          }
        });
      });
      return nextStore;
    }
    case RENAME_PLATFORM: {
      return {
        ...store,

      };
    }
    case RENAME_NAME: {
      return {
        ...store,

      };
    }
    case RENAME_VARIABLE_VALUE: {
      const { variableName, newValue, stateName } = action.payload;
      const nextStore = { ...store };
      const state = nextStore.representation.states[stateName];
      const { properties } = state;
      Object.keys(properties).forEach((name) => {
        if (name === variableName) {
          properties[variableName] = newValue;
        }
      });
      return nextStore;
    }
    case REMOVE_STATE: {
      const nextStore = { ...store };
      const stateName = nextStore.idToName[action.payload.id];
      Object.values(nextStore.representation.states)
        .forEach((state) => {
          // $FlowFixMe
          if (state.transitions.next === stateName) {
            state.transitions.next = '';
          }
          // $FlowFixMe
          const { actions } = state.transitions;
          if (actions) {
            Object.keys(actions).forEach((actionKey) => {
              if (actions[actionKey] === stateName) {
                actions[actionKey] = '';
              }
            });
          }
        });
      delete nextStore.representation.states[nextStore.idToName[action.payload.id]];
      return nextStore;
    }
    case REMOVE_CONTEXT_VARIABLE: {
      const { variable } = action.payload;
      const nextStore = { ...store };
      delete nextStore.representation.context.variables[variable.name];
      return nextStore;
    }
    case REMOVE_PLATFORM: {
      return {
        ...store,

      };
    }
    case REMOVE_NAME: {
      return {
        ...store,

      };
    }
    case REMOVE_VARIABLE: {
      return {
        ...store,

      };
    }
    case REMOVE_ACTION: {
      const nextStore = { ...store };
      const { sourceID, targetID } = action.payload;
      const targetName = nextStore.idToName[targetID];
      const state = nextStore.representation.states[nextStore.idToName[sourceID]];
      const { transitions } = state;
      const { actions } = transitions;
      if (transitions.next === targetName) {
        // $FlowFixMe @todo why is this a Flow error?
        transitions.next = '';
      }
      if (actions) {
        Object.entries(actions).forEach((actionEntry) => {
          const targetNames = Object.values(actionEntry); // should really just be one element
          targetNames.forEach((name) => {
            if (name === targetName) {
              actions[actionEntry[0]] = '';
            }
          });
        });
      }
      return nextStore;
    }
    case UPDATE_COMPONENT_TYPE: {
      const nextStore = { ...store };
      const { stateName, componentType } = action.payload;
      console.log('UPDATE_COMPONENT_TYPE');
      console.log('stateName:', stateName);
      console.log('componentType:', componentType);
      const state = nextStore.representation.states[stateName];
      if (!state) {
        return nextStore;
      }
      state.component = componentType;
      return nextStore;
    }
    default:
      return store;
  }
};