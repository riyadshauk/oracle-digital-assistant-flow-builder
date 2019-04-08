// @flow
export type State = {
  component: string,
  properties: {
    [key: string]: string,
  },
  transitions: {
    actions: {
      [key: string]: string,
    },
    next?: {},
  },
  name: string,
};
export type ContextVariable = {
  name: string,
  entityType: string,
};

export type RepresentationStore = {
  representation: {
    metadata: {
      platformVersion: '1.0',
    },
    main: true,
    name: 'defaultName',
    parameters: {
      [key: string]: string | number,
    },
    context: {
      variables: {
        [key: string]: string,
      },
    },
    states: {
      [key: string]: State,
    },
  },
  idToName: {},
  stateNameToCount: {},
};