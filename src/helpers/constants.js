// @flow

/**
 * The purpose of breaking this file away from helpers.js is to reduce potential cyclical deps.
 * Why?: since this file just contains constants, it may be less prone to having deps, itself.
 */

export const definedSystemComponents = new Set<string>(['System.CopyVariables',
  'System.ConditionEquals',
  'System.ConditionExists',
  'System.Intent',
  'System.List',
  'System.Output',
  'System.SetVariable',
  'System.Text',
]);

export const definedSystemNodeTypes = new Set<string>(['copy-variables',
  'equals',
  'exists',
  'intent',
  'list',
  'output',
  'set-variable',
  'text',
]);

export const YAMLTabSpaces = 2;