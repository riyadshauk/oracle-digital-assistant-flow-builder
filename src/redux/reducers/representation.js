import {
  ADD_STATE, ADD_CONTEXT_VARIABLE, ADD_PLATFORM, ADD_NAME, ADD_PARAMETER,
  RENAME_STATE, RENAME_CONTEXT_VARIABLE, RENAME_PLATFORM, RENAME_NAME, RENAME_PARAMETER,
  REMOVE_STATE, REMOVE_CONTEXT_VARIABLE, REMOVE_PLATFORM, REMOVE_NAME, REMOVE_PARAMETER,
} from '../actionTypes';

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

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_STATE: {
      const newState = action.payload.state;
      return {
        ...state,
        states: {
          ...state.states,
          newState,
        },
      };
    }
    case ADD_CONTEXT_VARIABLE: {
      return {
        ...state,

      };
    }
    case ADD_PLATFORM: {
      return {
        ...state,

      };
    }
    case ADD_NAME: {
      return {
        ...state,

      };
    }
    case ADD_PARAMETER: {
      return {
        ...state,

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