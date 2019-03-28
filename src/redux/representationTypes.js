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
  },
};
export type ContextVariable = {
  name: string,
  entityType: string,
};