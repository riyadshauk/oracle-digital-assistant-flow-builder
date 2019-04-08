// @flow
import { dump } from 'js-yaml';
import {
  // eslint-disable-next-line max-len
  ADD_STATE, ADD_CONTEXT_VARIABLE, ADD_PLATFORM, ADD_NAME, ADD_PARAMETER, ADD_ACTION, ADD_TRANSITION,
  // eslint-disable-next-line max-len
  RENAME_STATE, RENAME_CONTEXT_VARIABLE, RENAME_PLATFORM, RENAME_NAME, RENAME_PARAMETER,
  // eslint-disable-next-line max-len
  REMOVE_STATE, REMOVE_CONTEXT_VARIABLE, REMOVE_PLATFORM, REMOVE_NAME, REMOVE_PARAMETER, REMOVE_ACTION,
} from '../actionTypes';
import {
  type State, type ContextVariable, type RepresentationStore,
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

const generateNextStoreNameCount = (store: RepresentationStore, StoreName: string) => {
  if (Object.prototype.hasOwnProperty.call(store.stateNameToCount, [StoreName])) {
    store.stateNameToCount[StoreName] += 1;
  } else {
    store.stateNameToCount[StoreName] = 1;
  }
  return store.stateNameToCount[StoreName];
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
      const count = generateNextStoreNameCount(store, stateName);
      store.idToName[stateId] = stateName + count;
      nextStore.representation.states[
        store.idToName[stateId]
      ] = state;
      return nextStore;
    }
    case ADD_CONTEXT_VARIABLE: {
      const { variable } = action.payload;
      const { name, entityType } = (variable: ContextVariable);
      return {
        ...store,
        representation: {
          ...store.representation,
          context: {
            variables: {
              ...store.representation.context.variables,
              ...{ [name]: entityType },
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
    case ADD_PARAMETER: {
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
      return {
        ...store,
      };
    }
    case RENAME_CONTEXT_VARIABLE: {
      const { prev, cur } = action.payload;
      const nextStore = { ...store };
      delete nextStore.representation.context.variables[prev.name];
      nextStore.representation.context.variables[cur.name] = cur.entityType;
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
    case RENAME_PARAMETER: {
      return {
        ...store,

      };
    }
    case REMOVE_STATE: {
      const nextStore = { ...store };
      const stateName = nextStore.idToName[action.payload.id];
      Object.values(nextStore.representation.states)
        .forEach((state) => {
          // $FlowFixMe
          const { actions } = state.transitions;
          Object.keys(actions).forEach((actionKey) => {
            if (actions[actionKey] === stateName) {
              actions[actionKey] = '';
            }
          });
          // $FlowFixMe
          if (state.transitions.next === stateName) {
            state.transitions.next = '';
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
    case REMOVE_PARAMETER: {
      return {
        ...store,

      };
    }
    case REMOVE_ACTION: {
      const nextStore = { ...store };
      const { sourceID, targetID } = action.payload;
      const targetName = nextStore.idToName[targetID];
      const { transitions } = nextStore.representation.states[nextStore.idToName[sourceID]];
      const { actions } = transitions;
      Object.entries(actions).forEach((actionEntry) => {
        const targetNames = Object.values(actionEntry); // should really just be one element
        targetNames.forEach((name) => {
          if (name === targetName) {
            actions[actionEntry[0]] = '';
          }
        });
      });
      if (transitions.next === targetName) {
        // $FlowFixMe @todo why is this a Flow error?
        transitions.next = '';
      }
      return nextStore;
    }
    default:
      return store;
  }
};