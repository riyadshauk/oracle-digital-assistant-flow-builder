// @flow
import { dump } from 'js-yaml';
import {
  ADD_STATE, ADD_CONTEXT_VARIABLE, ADD_PLATFORM, ADD_NAME, ADD_PARAMETER,
  RENAME_STATE, RENAME_CONTEXT_VARIABLE, RENAME_PLATFORM, RENAME_NAME, RENAME_PARAMETER,
  REMOVE_STATE, REMOVE_CONTEXT_VARIABLE, REMOVE_PLATFORM, REMOVE_NAME, REMOVE_PARAMETER,
} from '../actionTypes';
import {
  type State, type ContextVariable,
} from '../representationTypes';

const initialState = {
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
};

export default (state: typeof initialState = initialState,
  action: { type: string, payload: { [key: string]: any } }) => {
  console.log('bot yaml:\n\n', dump(state));
  switch (action.type) {
    case ADD_STATE: {
      const newState: State = action.payload.state;
      return {
        ...state,
        states: {
          ...state.states,
          newState,
        },
      };
    }
    case ADD_CONTEXT_VARIABLE: {
      const { variable } = action.payload;
      const { name, entityType } = (variable: ContextVariable);
      return {
        ...state,
        context: {
          variables: {
            ...state.context.variables,
            ...{ [name]: entityType },
          },
        },
      };
    }
    case ADD_PLATFORM: {
      const { platformVersion } = action.payload;
      return {
        ...state,
        metadata: { platformVersion },
      };
    }
    case ADD_NAME: {
      const { botName } = action.payload;
      return {
        ...state,
        name: botName,
      };
    }
    case ADD_PARAMETER: {
      const { param } = action.payload;
      return {
        ...state,
        parameters: {
          ...state.parameters,
          ...param,
        },
      };
    }
    case RENAME_STATE: {
      return {
        ...state,

      };
    }
    case RENAME_CONTEXT_VARIABLE: {
      return {
        ...state,

      };
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
      return {
        ...state,

      };
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
    default:
      return state;
  }
};