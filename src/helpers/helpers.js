// @flow
import * as React from 'react';
import {
  DefaultPortLabel,
  NodeModel,
} from 'storm-react-diagrams';
import { DefaultComponentPortLabel } from './ClassComponents';
import {
  type ContextVariable,
} from '../redux/representationTypes';

export function registerNotEditable(...variableNames: string[]) {
  variableNames.forEach((variableName) => {
    this.state.notEditable[variableName] = true;
  });
}

export function clearPropertyName() {
  this.setState({ propertyName: '' });
}

export function clearPropertyValue() {
  this.setState({ propertyValue: '' });
}

const alreadyHasPropertyWithSameName = (node: NodeModel, propertyName: string): boolean => {
  const ports = [...node.getInPorts(), ...node.getOutPorts()];
  for (let i = 0; i < ports.length; i += 1) {
    const re = RegExp(`${propertyName} –– `, 'g');
    const portName = ports[i].label;
    const occurrences = portName.match(re);
    if (occurrences !== undefined && occurrences && occurrences.length === 1) {
      return true;
    }
  }
  return false;
};

const isValidNewPropertyName = (node: NodeModel, propertyName: string): boolean => {
  if (!propertyName) {
    return false; // do not allow un-named variables, here
  }
  if (alreadyHasPropertyWithSameName(node, propertyName)) {
    return false;
  }
  return true;
};

export function addLabel(
  addContextVariable?: (variableName: ContextVariable) => void,
) {
  const { node } = this.props;
  const { propertyName, propertyValue } = this.state;
  if (!isValidNewPropertyName(node, propertyName)) {
    return;
  }
  node.addInPort(`${propertyName} –– ${propertyValue}`);
  if (typeof addContextVariable === 'function') {
    addContextVariable({ name: propertyName, entityType: propertyValue });
  }
}

export function updateLabel(
  addContextVariable?: (variableName: ContextVariable) => void,
  renameContextVariable?: ({ prev: ContextVariable, cur: ContextVariable }) => void,
) {
  const { node } = this.props;
  const { propertyName, propertyValue } = this.state;
  if (!propertyName) {
    return; // do not allow un-named variables, here
  }
  const ports = node.getInPorts();
  const re = RegExp(`${propertyName} –– `, 'g');
  for (let i = 0; i < ports.length; i += 1) {
    const portName = ports[i].label;
    const occurrences = portName.match(re);
    if (occurrences !== undefined && occurrences && occurrences.length === 1) {
      if (typeof renameContextVariable === 'function') {
        const prevVals = ports[i].label.split(' –– ');
        console.log('prevVals:', prevVals);
        console.log('propertyName, propertyValue:', propertyName, propertyValue);
        renameContextVariable({
          prev: { name: prevVals[0], entityType: prevVals[1] },
          cur: { name: propertyName, entityType: propertyValue },
        });
      }

      ports[i].label = `${propertyName} –– ${propertyValue}`;
      this.state.isEditing[ports[i].name] = false;
      break;
    }
  }
  if (typeof addContextVariable === 'function') {
    addContextVariable({ name: propertyName, entityType: propertyValue });
  }
}

export function addRawLabel() {
  const { node } = this.props;
  const { propertyName } = this.state;
  if (!isValidNewPropertyName(node, propertyName)) {
    return;
  }
  node.addInPort(propertyName);
}

export function updateRawLabel() {
  const { node } = this.props;
  const { propertyName } = this.state;
  if (!isValidNewPropertyName(node, propertyName)) {
    return;
  }
  const ports = node.getInPorts();
  const re = RegExp(`${propertyName}`, 'g');
  for (let i = 0; i < ports.length; i += 1) {
    const portName = ports[i].label;
    const occurrences = portName.match(re);
    if (occurrences !== undefined && occurrences && occurrences.length === 1) {
      ports[i].label = propertyName;
      this.state.isEditing[ports[i].name] = false;
      break;
    }
  }
}

export function updatePropertyName(event: SyntheticInputEvent<EventTarget>) {
  this.setState({ propertyName: event.target.value });
}

export function updatePropertyValue(event: SyntheticInputEvent<EventTarget>) {
  this.setState({ propertyValue: event.target.value });
}

export function isEditing() {
  return Object.values(this.state.isEditing).reduce((prev, cur) => (prev || cur), false);
}

export function editClicked(port: any) {
  if (isEditing.apply(this)) {
    this.state.isEditing[port.props.name] = false;
    this.forceUpdate();
  } else {
    this.state.isEditing[port.props.name] = true;
    const { label } = port.props.node.ports[port.props.name];
    const vals = label.split('––');
    const propertyName = vals[0].trim();
    const propertyValue = vals[1].trim();
    this.setState({ propertyName, propertyValue });
  }
}

export function generatePort(port: any) {
  // eslint-disable-next-line react/no-this-in-sfc
  const { notEditable } = this.state;
  if (notEditable[port.label]) {
    return <DefaultPortLabel model={port} key={port.id} />;
  }
  return (
    <DefaultComponentPortLabel
      model={port}
      key={port.id}
      // eslint-disable-next-line react/jsx-no-bind
      editClicked={editClicked.bind(this)}
      // eslint-disable-next-line
      isEditing={this.state.isEditing[port.name]}
    />
  );
}

export function addOrUpdateProperty(event: Event,
  addContextVariable?: (variableName: { name: string, entityType: string }) => void,
  renameContextVariable?: ({ prev: ContextVariable, cur: ContextVariable }) => void) {
  event.preventDefault(); // prevent form submission from routing browser to different path
  if (isEditing.apply(this)) {
    updateLabel.apply(this, [addContextVariable, renameContextVariable]);
  } else {
    addLabel.apply(this, [addContextVariable]);
  }
  clearPropertyName.apply(this);
  clearPropertyValue.apply(this);
  // @todo this may not be a correct approach: https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-applying-setstate#answer-35004739
  this.forceUpdate(); // force re-render (to fix bug when user needs to click again to re-render)
}

export function addOrUpdateRawProperty(event: Event) {
  event.preventDefault(); // prevent form submission from routing browser to different path
  if (isEditing.apply(this)) {
    updateRawLabel.apply(this);
  } else {
    addRawLabel.apply(this);
  }
  clearPropertyName.apply(this);
  clearPropertyValue.apply(this);
  // @todo this may not be a correct approach: https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-applying-setstate#answer-35004739
  this.forceUpdate(); // force re-render (to fix bug when user needs to click again to re-render)
}