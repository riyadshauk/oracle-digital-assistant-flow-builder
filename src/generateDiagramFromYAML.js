// @flow
/* eslint-env browser */
import {
  NodeModel,
  PortModel,
  DiagramModel,
} from 'storm-react-diagrams';
import { safeLoad } from 'js-yaml';

import './sass/main.scss';
import { AdvancedNodeModel, AdvancedLinkModel } from './AdvancedDiagramFactories';
import store from './redux/store';
import { addName, addPlatform } from './redux/actions/representation';

let representation = {};

const getVariablePort = (activeModel: DiagramModel, nodeName: string, variableName: string) => {
  const { nameToID } = store.getState().representation;
  const node = activeModel.getNode(nameToID[nodeName]);
  let variablePort;
  Object.values(node.ports).forEach((port) => {
    const contextVariableName = port.label.split('––')[0].trim();
    if (String(variableName).trim() === contextVariableName) {
      variablePort = port;
    }
  });
  return variablePort;
};

const getContextVariablePort = (activeModel, variableName: string) => getVariablePort(activeModel, 'Context', variableName);

const getParametersVariablePort = (activeModel, variableName: string) => getVariablePort(activeModel, 'Parameters', variableName);

const getSystemVariablesVariablePort = (activeModel, variableName: string) => getVariablePort(activeModel, 'SystemVariables', variableName);

/**
 * @see https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js
 */
const addVariable = (nodeID: string, variableName: string, entityType: string) => {
  const nodeVariableFormLabel = document.querySelector(`[data-nodeid="${nodeID}"] form label`);
  const formParts = [...nodeVariableFormLabel.children];
  const name = formParts[0];
  const entity = formParts[2];
  const addPropertyButton = formParts[4];
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  const event = new Event('input', { bubbles: true });

  nativeInputValueSetter.call(name, variableName);
  name.dispatchEvent(event);

  nativeInputValueSetter.call(entity, entityType);
  entity.dispatchEvent(event);

  addPropertyButton.click();
};

const addContextVariable = (
  activeModel: DiagramModel, variableName: string, entityType: string,
) => {
  const contextNodeID = store.getState().representation.nameToID.Context;
  addVariable(contextNodeID, variableName, entityType);
  return getContextVariablePort(activeModel, variableName);
};

const addParameterVariable = (
  activeModel: DiagramModel, variableName: string, entityType: string,
) => {
  const parametersNodeID = store.getState().representation.nameToID.Parameters;
  addVariable(parametersNodeID, variableName, entityType);
  return getParametersVariablePort(activeModel, variableName);
};

const addSystemVariablesVariable = (
  activeModel: DiagramModel, variableName: string,
) => {
  const systemVariablesNodeID = store.getState().representation.nameToID.SystemVariables;
  addVariable(systemVariablesNodeID, variableName, 'builtin');
  return getSystemVariablesVariablePort(activeModel, variableName);
};

const addContextVariablesToDiagramFromYAML = (activeModel) => {
  setTimeout(() => {
    Object.entries(((representation || {}).context || {}).variables || {})
      .forEach(([variableName, entityType]: any) => (
        addContextVariable(activeModel, variableName, entityType)
      ));
  });
};

const addPlatformVersionToYAML = () => {
  setTimeout(() => {
    if (((representation || {}).metadata || {}).platformVersion) {
      store.dispatch(addPlatform(representation.metadata.platformVersion));
    }
  });
};

const addNameToYAML = () => {
  setTimeout(() => {
    if ((representation || {}).name) {
      store.dispatch(addName(representation.name));
    }
  });
};

const addParametersToDiagramFromYAML = (activeModel: DiagramModel) => {
  setTimeout(() => {
    Object.entries((representation || {}).parameters || {})
      .forEach(([variableName, variableValue]) => (
        addParameterVariable(activeModel, variableName, variableValue)
      ));
  });
};

const addStatesToDiagramFromYAML = (activeModel: DiagramModel) => {
  Object.entries((representation || {}).states || {}).forEach((entry: any, idx) => {
    const [nodeName, state] = entry;
    const { component } = state;
    let componentType = '';
    switch (component) {
      case 'System.CopyVariables':
        componentType = 'copy-variables';
        break;
      case 'System.ConditionEquals':
        componentType = 'equals';
        break;
      case 'System.ConditionExists':
        componentType = 'exists';
        break;
      case 'System.Intent':
        componentType = 'intent';
        break;
      case 'System.List':
        componentType = 'list';
        break;
      case 'System.Output':
        componentType = 'output';
        break;
      case 'System.SetVariable':
        componentType = 'set-variable';
        break;
      case 'System.Text':
        componentType = 'text';
        break;
      default:
        componentType = 'general';
        break;
    }
    const node = new AdvancedNodeModel(
      nodeName,
      undefined,
      componentType,
    );
    node.x = 25;
    node.y = 300 * (idx + 1);
    activeModel.addNode(node);
  });
};

const mapYAMLActionKeyToNodeActionKey = (YAMLActionKey: string) => {
  if (YAMLActionKey === 'exists' || YAMLActionKey === 'equal') {
    return 'true';
  }
  if (YAMLActionKey === 'notexists' || YAMLActionKey === 'notequal') {
    return 'false';
  }
  return YAMLActionKey;
};

const findPortWithLabel = (node: NodeModel, label: any) => {
  let port;
  Object.values(node.ports).forEach((nodePort) => {
    if (nodePort.label === label) {
      port = nodePort;
    }
  });
  return port;
};

const integrateStatesInDiagramFromYAML = (activeModel: DiagramModel) => {
  setTimeout(
    () => {
      const { nameToID } = store.getState().representation;

      const states = Object.entries((representation || {}).states || {});

      states.forEach((entry, idx) => {
        const [stateName, state] = entry;
        const node = activeModel.getNode(nameToID[stateName]);


        const { properties, component, transitions } = state;
        const { variable } = properties;
        if (node.type === 'general') {
          const event = new Event('input', { bubbles: true });
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

          // rename general component type
          const editComponentTypeButton = document.querySelector(`[data-nodeid="${nameToID[stateName]}"] .srd-default-node__title button`);
          editComponentTypeButton.click(); // start editing
          const componentTypeInput = document.querySelector(`[data-nodeid="${nameToID[stateName]}"] .srd-default-node__title input`);
          nativeInputValueSetter.call(componentTypeInput, component);
          componentTypeInput.dispatchEvent(event);
          editComponentTypeButton.click(); // save edits

          // add transitions, actions, and properties
          const buttons = [
            ...document.querySelectorAll(`[data-nodeid="${nameToID[stateName]}"] button`),
          ];
          buttons.forEach((button) => {
            switch (button.innerHTML) {
              case 'Add Transition': {
                const transitionInput = button.parentElement.querySelector('input');
                Object.entries(transitions).forEach(([transitionName]) => {
                  if (transitionName === 'actions') {
                    return;
                  }
                  nativeInputValueSetter.call(transitionInput, transitionName);
                  transitionInput.dispatchEvent(event);
                  button.click();
                });
              }
                break;
              case 'Add Action': {
                const addActionInput = button.parentElement.querySelector('input');
                Object.entries(transitions.actions || {}).forEach(([actionName]) => {
                  nativeInputValueSetter.call(addActionInput, actionName);
                  addActionInput.dispatchEvent(event);
                  button.click();
                });
              }
                break;
              case 'Add Property': {
                const addPropertyNameInput = button.parentElement.querySelector('input');
                Object.entries(properties || {}).forEach(([propertyName, propertyValue]) => {
                  // add propertyValue to diagram
                  nativeInputValueSetter.call(addPropertyNameInput, propertyName);
                  addPropertyNameInput.dispatchEvent(event);
                  button.click();
                  // if propertyValue exists as a variableName, create link to it in diagram
                  if (!propertyValue) {
                    return;
                  }
                  if (typeof propertyValue === 'object') {
                    try {
                      // eslint-disable-next-line no-param-reassign
                      propertyValue = JSON.stringify(propertyValue);
                    } catch (err) {
                      // do nothing for now
                    }
                  }
                  let variablePort;
                  Object.keys(store.getState().representation.representation.context.variables)
                    .forEach((variableName) => {
                      if (variableName === propertyValue) {
                        variablePort = getContextVariablePort(activeModel, variableName);
                      }
                    });
                  Object.keys(store.getState().representation.systemVariables)
                    .forEach((variableName) => {
                      if (variableName === propertyValue) {
                        variablePort = getSystemVariablesVariablePort(activeModel, variableName);
                      }
                    });
                  Object.keys(store.getState().representation.representation.parameters)
                    .forEach((variableName) => {
                      if (variableName === propertyValue) {
                        variablePort = getParametersVariablePort(activeModel, variableName);
                      }
                    });
                  if (!variablePort) {
                    variablePort = addSystemVariablesVariable(activeModel, propertyValue);
                  }
                  // create link from variablePort to port that was just created
                  Object.values(node.ports).forEach((port) => {
                    if (port.label === propertyName) {
                      const link = new AdvancedLinkModel();
                      link.setSourcePort(port);
                      link.setTargetPort(variablePort);
                      activeModel.addLink(link);
                    }
                  });
                });
                break;
              }
              default:
                break;
            }
          });
        }
        if (variable) {
          // create link in diagram to variable, also add variable to representation in state
          let contextVariablePort = getContextVariablePort(activeModel, variable);
          if (!contextVariablePort) {
            contextVariablePort = addSystemVariablesVariable(activeModel, variable);
          }

          let sourcePort: PortModel;
          Object.values(node.ports).forEach((port) => {
            if (port.label === 'variable') {
              sourcePort = port;
            }
          });
          // add links to context variable
          const link = new AdvancedLinkModel();
          link.setSourcePort(sourcePort);
          link.setTargetPort(contextVariablePort);
          activeModel.addLink(link);
        }
        // add links to actions (if applicable / stateName provided)
        const { actions } = transitions;
        if (actions) {
          Object.entries(actions).forEach((actionEntry) => {
            const [YAMLActionKey, stateNameToTransitionTo] = actionEntry;
            if (stateNameToTransitionTo === null) {
              return;
            }
            const nodeActionKey = mapYAMLActionKeyToNodeActionKey(YAMLActionKey);
            const targetNode = activeModel.getNode(nameToID[stateNameToTransitionTo]);
            const targetNodePort = findPortWithLabel(targetNode, 'IN');
            const link = new AdvancedLinkModel();
            const sourceNodePort = findPortWithLabel(node, nodeActionKey);

            if (sourceNodePort !== undefined && targetNodePort !== undefined) {
              link.addLabel(`${node.name} ––> ${targetNode.name}`);
              link.setSourcePort(sourceNodePort);
              link.setTargetPort(targetNodePort);
              activeModel.addLink(link);
            }
          });
        }
        const ret = transitions.return;
        if (!actions && !ret && idx < states.length - 1) {
          const link = new AdvancedLinkModel();
          const sourceNodePort = findPortWithLabel(node, 'OUT');
          const [nextNodeStateName] = states[idx + 1];
          const nextNode = activeModel.getNode(nameToID[nextNodeStateName]);
          const targetNodePort = findPortWithLabel(nextNode, 'IN');
          if (sourceNodePort !== undefined && targetNodePort !== undefined) {
            link.addLabel(`${node.name} ––> ${nextNode.name}`);
            link.setSourcePort(sourceNodePort);
            link.setTargetPort(targetNodePort);
            activeModel.addLink(link);
          }
        }
      });
    },
  );
};

const mapValuesFromYAMLToDiagramRepresentation = (activeModel: DiagramModel) => {
  setTimeout(() => {
    const delimeter = ' –– ';
    const { nameToID } = store.getState().representation;
    const states = Object.entries((representation || {}).states || {});
    states.forEach((entry) => {
      const [stateName, state] = entry;
      const node = activeModel.getNode(nameToID[stateName]);
      Object.values(node.ports || {}).forEach((port) => {
        const label = port.label.replace(delimeter, '');
        // eslint-disable-next-line no-prototype-builtins
        if (state.properties.hasOwnProperty(label)) {
          // press Edit Value button
          const buttons = document.querySelectorAll(`[data-nodeid="${nameToID[stateName]}"] button`);
          let buttonClicked = false;
          buttons.forEach((button) => {
            if (button.innerHTML === 'Edit Value'
              && button.previousElementSibling.innerHTML.replace(delimeter, '') === label) {
              button.click();
              buttonClicked = true;
            }
          });

          if (!buttonClicked) {
            return;
          }

          //  form filling stuff...
          const form = document.querySelector(`[data-nodeid="${nameToID[stateName]}"] form`);
          if (!form) { // @todo why would this happen??
            return;
          }
          const formParts = [...form.children[0].children];
          const valueInput = formParts[2];
          const saveEditsButton = formParts[4];
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          const event = new Event('input', { bubbles: true });

          const name = formParts[0];
          name.dispatchEvent(event);

          nativeInputValueSetter.call(valueInput, state.properties[label]);
          valueInput.dispatchEvent(event);

          saveEditsButton.click();
        }
      });
    });
  });
};

export default (yaml: string) => {
  representation = safeLoad(yaml);
  addPlatformVersionToYAML();
  addNameToYAML();
  addParametersToDiagramFromYAML(window.activeModel);
  addContextVariablesToDiagramFromYAML(window.activeModel);
  addStatesToDiagramFromYAML(window.activeModel);
  window.diagramEngine.repaintCanvas();
  integrateStatesInDiagramFromYAML(window.activeModel);
  mapValuesFromYAMLToDiagramRepresentation(window.activeModel);
  setTimeout(() => window.diagramEngine.repaintCanvas());
};