// @flow
import { dump } from 'js-yaml';
import {
  // eslint-disable-next-line max-len
  ADD_STATE, ADD_CONTEXT_VARIABLE, ADD_PLATFORM, ADD_NAME, ADD_PARAMETER, ADD_TRANSITION,
  // eslint-disable-next-line max-len
  RENAME_STATE, RENAME_CONTEXT_VARIABLE, RENAME_PLATFORM, RENAME_NAME, RENAME_PARAMETER,
  // eslint-disable-next-line max-len
  REMOVE_STATE, REMOVE_CONTEXT_VARIABLE, REMOVE_PLATFORM, REMOVE_NAME, REMOVE_PARAMETER, REMOVE_TRANSITION,
} from '../actionTypes';
import {
  type State, type ContextVariable,
} from '../representationTypes';

const initialState = {
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
};

const stateNameToCount = {};
const generateNextStateNameCount = (stateName: string) => {
  if (Object.prototype.hasOwnProperty.call(stateNameToCount, [stateName])) {
    stateNameToCount[stateName] += 1;
  } else {
    stateNameToCount[stateName] = 1;
  }
  return stateNameToCount[stateName];
};

export default (state: typeof initialState = initialState,
  action: { type: string, payload: { [key: string]: any } }) => {
  console.log('bot yaml:\n\n', dump(state));
  switch (action.type) {
    case ADD_STATE: {
      const newState: State = action.payload.state;
      const newStateName: string = action.payload.name;
      const nextState = { ...state };
      nextState.representation.states[
        newStateName + generateNextStateNameCount(newStateName)
      ] = newState;
      return nextState;
    }
    case ADD_CONTEXT_VARIABLE: {
      const { variable } = action.payload;
      const { name, entityType } = (variable: ContextVariable);
      return {
        ...state,
        representation: {
          ...state.representation,
          context: {
            variables: {
              ...state.representation.context.variables,
              ...{ [name]: entityType },
            },
          },
        },
      };
    }
    case ADD_PLATFORM: {
      const { platformVersion } = action.payload;
      return {
        ...state,
        representation: {
          ...state.representation,
          metadata: { platformVersion },
        },
      };
    }
    case ADD_NAME: {
      const { botName } = action.payload;
      return {
        ...state,
        representation: {
          ...state.representation,
          name: botName,
        },
      };
    }
    case ADD_PARAMETER: {
      const { param } = action.payload;
      return {
        ...state,
        representation: {
          ...state.representation,
          parameters: {
            ...state.representation.parameters,
            ...param,
          },
        },
      };
    }
    case ADD_TRANSITION: {
      const { sourceState, targetState } = action.payload;
      const nextState = { ...state };
      nextState.representation.states[sourceState.name] = targetState.name;
      return nextState;
    }
    case RENAME_STATE: {
      return {
        ...state,
      };
    }
    case RENAME_CONTEXT_VARIABLE: {
      const { prev, cur } = action.payload;
      const nextState = { ...state };
      delete nextState.representation.context.variables[prev.name];
      nextState.representation.context.variables[cur.name] = cur.entityType;
      return nextState;
    }
    case RENAME_PLATFORM: {
      return {
        ...state,

      };
    }
    case RENAME_NAME: {
      return {
        ...state,

      };
    }
    case RENAME_PARAMETER: {
      return {
        ...state,

      };
    }
    case REMOVE_STATE: {
      return {
        ...state,

      };
    }
    case REMOVE_CONTEXT_VARIABLE: {
      const { variable } = action.payload;
      const nextState = { ...state };
      delete nextState.representation.context.variables[variable.name];
      return nextState;
    }
    case REMOVE_PLATFORM: {
      return {
        ...state,

      };
    }
    case REMOVE_NAME: {
      return {
        ...state,

      };
    }
    case REMOVE_PARAMETER: {
      return {
        ...state,

      };
    }
    case REMOVE_TRANSITION: {
      return { ...state };
    }
    default:
      return state;
  }
};