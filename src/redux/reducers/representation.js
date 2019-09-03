// @flow
// import { dump } from 'js-yaml';
import {
  // eslint-disable-next-line max-len
  ADD_STATE, ADD_CONTEXT_VARIABLE, ADD_PLATFORM, ADD_NAME, ADD_VARIABLE, ADD_ACTION, ADD_TRANSITION, ADD_TRANSITION_PROPERTY, ADD_ACTION_PROPERTY, ADD_PARAMETER, ADD_PROPERTY, ADD_SYSTEM_VARIABLE,
  // eslint-disable-next-line max-len
  RENAME_STATE, RENAME_CONTEXT_VARIABLE, RENAME_PLATFORM, RENAME_NAME, RENAME_VARIABLE_VALUE, RENAME_TRANSITION_PROPERTY, RENAME_ACTION_PROPERTY, RENAME_PARAMETER, RENAME_PROPERTY_VALUE, RENAME_SYSTEM_VARIABLE,
  // eslint-disable-next-line max-len
  REMOVE_STATE, REMOVE_CONTEXT_VARIABLE, REMOVE_PLATFORM, REMOVE_NAME, REMOVE_VARIABLE, REMOVE_ACTION, REMOVE_TRANSITION, REMOVE_TRANSITION_PROPERTY, REMOVE_ACTION_PROPERTY, REMOVE_PARAMETER, REMOVE_PROPERTY,
  UPDATE_COMPONENT_TYPE, UPDATE_PROPERTY, REMOVE_SYSTEM_VARIABLE,
  MAP_NAME_TO_ID,
  RESET_REPRESENTATION,
} from '../actionTypes/representation';
import {
  type State, type Variable, type RepresentationStore,
} from '../reducerTypes/representation';
import { definedSystemComponents } from '../../helpers/constants';

/**
 * @note We wrap the initial store in a closure so that it is dynamically created (recursively),
 * so that no part of it is shallow-copied (so we leverage it when resetting the store).
 */
const initialStore = () => ({
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
  nameToID: {},
  stateNameToCount: {},
  portIDToPath: {},
  systemVariables: {},
});

const generateNextStateNameCount = (store: RepresentationStore, stateName: string) => {
  if (Object.prototype.hasOwnProperty.call(store.stateNameToCount, [stateName])) {
    let count = store.stateNameToCount[stateName] + 1;
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

const renameVariableReducerWrapper = (
  store: RepresentationStore,
  action: { type: string, payload: { [key: string]: any } },
) => ((o: any) => {
  const { prev, cur } = action.payload;
  const nextStore = { ...store };
  delete o[prev.name];
  // disallow duplicate variable names
  if (Object.prototype.hasOwnProperty.call(o, cur)) {
    return nextStore;
  }
  o[cur.name] = cur.value;
  // fix transitions in store (variable values in states) related to changing the variable name
  Object.values(nextStore.representation.states).forEach((state) => {
    const { properties } = state;
    Object.keys(properties).forEach((property) => {
      if (property === 'variable'
        && properties[property] === prev.name) {
        properties[property] = cur.name;
      }
    });
  });
  return nextStore;
});

export default (store: RepresentationStore = initialStore(),
  action: { type: string, payload: { [key: string]: any } }) => {
  const renameVariableReducer = renameVariableReducerWrapper(store, action);
  switch (action.type) {
    case ADD_STATE: {
      const { state } = action.payload;
      const stateNamePrefix: string = action.payload.name;
      const stateId: string = action.payload.id;
      const count = generateNextStateNameCount(store, stateNamePrefix);
      const stateName = count > 1 ? stateNamePrefix + count : stateNamePrefix;
      // eslint-disable-next-line no-prototype-builtins
      if (state.transitions.hasOwnProperty('return')) {
        state.transitions.return = stateName;
      }
      const nextStore = {
        ...store,
        idToName: {
          ...store.idToName,
          [stateId]: stateName,
        },
        nameToID: {
          ...store.nameToID,
          [stateName]: stateId,
        },
      };
      nextStore.representation.states = {
        ...store.representation.states,
        [nextStore.idToName[stateId]]: state,
      };
      return nextStore;
    }
    case ADD_CONTEXT_VARIABLE: {
      const { variable } = action.payload;
      const { name, value } = (variable: Variable);
      const nextStore = { ...store };
      nextStore.representation.context.variables = {
        ...nextStore.representation.context.variables,
        [name]: value,
      };
      return nextStore;
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

      // eslint-disable-next-line no-prototype-builtins
      if (sourceState.properties.hasOwnProperty(sourceActionName)) {
        // handle case for linking to context variable
        if (targetID !== undefined
          && targetID
          && nextStore.representation.states[nextStore.idToName[targetID]] === undefined) {
          sourceState.properties[sourceActionName] = targetLabelName;
        } // otherwise 'variable' attempted to link to a non-context variable, so do nothing
        return nextStore;
      }
      if (sourceState.transitions.actions !== undefined
        && nextStore.idToName[targetID] !== undefined
      ) {
        sourceState.transitions.actions[actualActionName] = nextStore.idToName[targetID];
        // eslint-disable-next-line no-prototype-builtins
        if (sourceState.transitions.hasOwnProperty('return')) {
          delete sourceState.transitions.return;
        }
      }
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
      // eslint-disable-next-line no-prototype-builtins
      if (sourceState.transitions.hasOwnProperty('return')) {
        delete sourceState.transitions.return;
      }
      return nextStore;
    }
    case ADD_TRANSITION_PROPERTY: {
      const nextStore = { ...store };
      return nextStore;
    }
    case ADD_ACTION_PROPERTY: {
      const nextStore = { ...store };
      return nextStore;
    }
    case ADD_PARAMETER: {
      const { variable } = action.payload;
      const { name, value } = (variable: Variable);
      const nextStore = { ...store };
      nextStore.representation.parameters = {
        ...nextStore.representation.parameters,
        [name]: value,
      };
      return nextStore;
    }
    case ADD_SYSTEM_VARIABLE: {
      const { variable } = action.payload;
      const { name, value } = (variable: Variable);
      const nextStore = { ...store };
      /**
       * @note These variables are not part of the representation that maps to YAML.
       */
      nextStore.systemVariables = {
        ...nextStore.systemVariables,
        [name]: value,
      };
      return nextStore;
    }
    case ADD_PROPERTY: {
      const nextStore = { ...store };
      const {
        stateName,
        propertyKey,
        propertyValue,
        componentPropertyType,
        path,
        portID,
      } = action.payload;
      const state = nextStore.representation.states[stateName];
      switch (componentPropertyType.toLowerCase()) {
        case 'transition':
          /**
           * @todo why would this happen? This condition shouldn't be needed
           * @bug (in code reasoning)
           */
          if (propertyKey !== 'actions') {
            state.transitions[propertyKey] = '';
          }
          break;
        case 'action':
          state.transitions.actions[propertyKey] = '';
          break;
        case 'property':
          state.properties[propertyKey] = '';
          break;
        default:
          if (propertyValue !== undefined) { // ie, case for general component
            state[propertyKey] = propertyValue;
          }
          break;
      }
      if (path) {
        nextStore.portIDToPath[portID] = path;
      }
      return nextStore;
    }

    case RENAME_PROPERTY_VALUE: {
      const nextStore = { ...store };
      const {
        propertyName,
        newValue,
        stateName,
        portID,
      } = action.payload;
      const state = nextStore.representation.states[stateName];
      const path = nextStore.portIDToPath[portID] || [];
      let stateProperty = state;
      path.forEach(prop => stateProperty = stateProperty[prop]);
      stateProperty[propertyName] = newValue;
      return nextStore;
    }
    case RENAME_STATE: {
      const nextStore = { ...store };
      const { oldName, newName } = action.payload;
      // disallow duplicate state names
      if (Object.prototype.hasOwnProperty.call(nextStore.representation.states, newName)) {
        return nextStore;
      }

      // update return, if relevant
      if (nextStore.representation.states[oldName].transitions.return === oldName) {
        nextStore.representation.states[oldName].transitions.return = newName;
      }

      // update state name in idToName
      Object.entries(nextStore.idToName).forEach(([id, name]) => {
        if (name === oldName) {
          nextStore.idToName[id] = newName;
        }
      });
      // update state name across all references in store
      Object.entries(nextStore.representation.states).forEach((state) => {
        const processEntry = (o, [k, v]) => {
          if (v === oldName) {
            o[k] = newName;
          }
        };
        // $FlowFixMe: "missing in mixed"
        Object.entries(state.properties || {})
          .forEach(entry => processEntry(state.properties, entry));
        // $FlowFixMe: "missing in mixed"
        Object.entries(state.transitions || {})
          .forEach(entry => processEntry(state.transitions, entry));
        // $FlowFixMe: "missing in mixed"
        if ((state.transitions || {}).actions) {
          Object.entries(state.transitions.actions)
            // $FlowFixMe: "missing in mixed"
            .forEach(entry => processEntry(state.transitions.actions, entry));
        }
        // eslint-disable-next-line no-prototype-builtins
        if ((state.transitions || {}).hasOwnProperty('return')) {
          processEntry(state.transitions, ['return', oldName]);
        }
      });
      const stateCopy = { ...nextStore.representation.states[oldName] };
      delete nextStore.representation.states[oldName];
      nextStore.representation.states[newName] = stateCopy;
      return nextStore;
    }
    case RENAME_CONTEXT_VARIABLE: {
      return renameVariableReducer(store.representation.context.variables);
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
      Object.keys(properties).forEach((propVariableName) => {
        if (propVariableName === variableName) {
          properties[variableName] = newValue;
        }
      });
      return nextStore;
    }
    case RENAME_TRANSITION_PROPERTY: {
      const nextStore = { ...store };
      return nextStore;
    }
    case RENAME_ACTION_PROPERTY: {
      const nextStore = { ...store };
      return nextStore;
    }
    case RENAME_PARAMETER: {
      return renameVariableReducer(store.representation.parameters);
    }
    case RENAME_SYSTEM_VARIABLE: {
      return renameVariableReducer(store.systemVariables);
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
      /**
       * @note: See REMOVE_TRANSITION for the full story of clearing out variable references.
       */
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
      if (!state) {
        return nextStore;
      }
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
    case REMOVE_TRANSITION: {
      const newStore = { ...store };
      const {
        sourcePortParentID,
        sourcePortLabel,
        targetPortLabel,
        targetPortParentID,
      } = action.payload;
      const sourceState = newStore.representation.states[newStore.idToName[sourcePortParentID]];
      const targetPortParentName = newStore.idToName[targetPortParentID];
      let targetName = targetPortLabel;
      if (targetPortLabel === 'IN') {
        targetName = targetPortParentName;
      }
      if (sourcePortLabel === 'variable') {
        targetName = targetName.split(' –– ');
        targetName = Array.isArray(targetName) && targetName.length > 0 ? targetName[0] : '';
      }
      const processEntry = (o, [k, v]) => {
        if (v === targetName) {
          o[k] = '';
        }
      };
      console.log('REMOVE_TRANSITION, action.payload:', action.payload);
      console.log('REMOVE_TRANSITION, sourceState:', sourceState);
      Object.entries(sourceState.properties || {})
        .forEach(entry => processEntry(sourceState.properties, entry));
      Object.entries(sourceState.transitions || {})
        .forEach(entry => processEntry(sourceState.transitions || {}, entry));
      if (sourceState.transitions.actions) {
        Object.entries((sourceState.transitions || {}).actions || {})
          .forEach(entry => processEntry(((sourceState.transitions || {}).actions || {}), entry));
      }
      // explicitly exit flow when no explicit transition is specified
      // eslint-disable-next-line no-prototype-builtins
      if (sourceState.hasOwnProperty('transitions')
        // eslint-disable-next-line no-prototype-builtins
        && sourceState.transitions.hasOwnProperty('actions')
        && Object.keys(sourceState.transitions.actions).length === 0) {
        sourceState.transitions.return = sourceState.name;
      }
      return newStore;
    }
    case REMOVE_TRANSITION_PROPERTY: {
      const nextStore = { ...store };
      return nextStore;
    }
    case REMOVE_ACTION_PROPERTY: {
      const nextStore = { ...store };
      return nextStore;
    }
    case REMOVE_PARAMETER: {
      const { propertyName } = action.payload;
      const nextStore = { ...store };
      /**
       * @note: See REMOVE_TRANSITION for the full story of clearing out variable references.
       */
      delete nextStore.representation.parameters[propertyName];
      return nextStore;
    }
    case REMOVE_SYSTEM_VARIABLE: {
      const { propertyName } = action.payload;
      const nextStore = { ...store };
      /**
       * @note: See REMOVE_TRANSITION for the full story of clearing out variable references.
       */
      delete nextStore.systemVariables[propertyName];
      return nextStore;
    }
    case REMOVE_PROPERTY: {
      const nextStore = { ...store };
      const { node, propertyName, portID } = action.payload;
      const state = nextStore.representation.states[node.name];
      const processEntry = (o, [k, v]) => {
        if (v === propertyName) {
          o[k] = '';
        }
      };
      const path = nextStore.portIDToPath[portID] || [];
      let stateProperty = state;
      path.forEach(prop => stateProperty = stateProperty[prop]);
      // only allow removal of property from general components
      if (state !== undefined && !definedSystemComponents.has(state.component)) {
        delete stateProperty[propertyName];

        // @todo delete propertyName from any references in states
        // $FlowFixMe (mixed type error)
        Object.values(nextStore.representation.states).forEach((curState: State) => {
          Object.entries(curState.properties)
            .forEach(entry => processEntry(curState.properties, entry));
          Object.entries(curState.transitions)
            .forEach(entry => processEntry(curState.transitions, entry));
          if (curState.transitions.actions) {
            Object.entries(curState.transitions.actions)
              .forEach(entry => processEntry(curState.transitions.actions, entry));
          }
        });
      } else if (node.name === 'Context') { // or from Context node (context variables)
        delete nextStore.representation.context.variables[propertyName];
        // @todo delete contextVariable from any referencing variable property
        // $FlowFixMe (mixed type error)
        Object.values(nextStore.representation.states).forEach((curState: State) => {
          if (curState.properties && curState.properties.variable === propertyName) {
            processEntry(curState.properties, ['variable', curState.properties.variable]);
          }
        });
      }
      return nextStore;
    }
    case UPDATE_COMPONENT_TYPE: {
      const nextStore = { ...store };
      const { stateName, componentType } = action.payload;
      const state = nextStore.representation.states[stateName];
      if (!state) {
        return nextStore;
      }
      state.component = componentType;
      return nextStore;
    }
    case UPDATE_PROPERTY: {
      const nextStore = { ...store };
      const { stateName, transitionProperty } = action.payload;
      const { transitions } = nextStore.representation.states[stateName];
      if (!Object.prototype.hasOwnProperty.call(transitions, transitionProperty)) {
        transitions[transitionProperty] = '';
      }
      return nextStore;
    }
    case MAP_NAME_TO_ID: {
      const { node } = action.payload;
      return {
        ...store,
        nameToID: { ...store.nameToID, [node.name]: node.id },
      };
    }
    case RESET_REPRESENTATION: {
      return initialStore();
    }
    default:
      return store;
  }
};