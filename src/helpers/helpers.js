// @flow
import * as React from 'react';
import {
  DefaultPortLabel,
  NodeModel,
} from 'storm-react-diagrams';
import { DefaultComponentPortLabel } from './ClassComponents';
import {
  addContextVariable,
  renameContextVariable,
  renameVariableValue,
  renameState,
  updateComponent,
  addProperty,
  updateProperty,
} from '../redux/actions';
import store from '../redux/store';
import { AdvancedPortModel, AdvancedNodeModel } from '../AdvancedDiagramFactories';

export function registerNotEditable(...variableNames: string[]) {
  variableNames.forEach((variableName) => {
    this.setState(prevState => ({
      notEditable: {
        ...prevState.notEditable,
        [variableName]: true,
      },
    }));
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

export function addLabel() {
  const { node } = this.props;
  const { propertyName, propertyValue } = this.state;
  if (!isValidNewPropertyName(node, propertyName)) {
    return;
  }
  node.addInPort(`${propertyName} –– ${propertyValue}`);
  if (Object.prototype.hasOwnProperty.call(this.state.representation, 'context')) {
    store.dispatch(
      addContextVariable({ name: propertyName, value: propertyValue }),
    );
  }
}

export function updateLabelWrapper(delimiter: string) {
  const { node } = this.props;
  const { propertyName, propertyValue } = this.state;
  const re = RegExp(`${propertyName}${delimiter}`, 'g');
  if (!propertyName) {
    return; // do not allow un-named variables, here
  }
  const ports = node.getInPorts();
  let variableRenamed = false;
  ports.forEach((port) => {
    const portName = port.label;
    const occurrences = portName.match(re);
    if (occurrences !== undefined && occurrences && occurrences.length === 1) {
      variableRenamed = true;
      const prevVals = portName.split(delimiter);
      const prev = { name: prevVals[0], value: prevVals[1] };
      const cur = { name: propertyName, value: propertyValue };
      if (Object.prototype.hasOwnProperty.call(this.state.representation, 'context')) {
        store.dispatch(renameContextVariable({ prev, cur }));
      } else {
        const stateName = this.state.name;
        store.dispatch(renameVariableValue({
          variableName: prevVals[0], newValue: propertyValue, stateName,
        }));
      }

      port.label = `${propertyName}${delimiter}${propertyValue}`;
      this.setState(prevState => ({
        isEditing: {
          ...prevState.isEditing,
          [port.name]: false,
        },
      }));
      // break; // @todo end forEach early? overkill?
    }
  });
  if (!variableRenamed) {
    if (Object.prototype.hasOwnProperty.call(this.state.representation, 'context')) {
      store.dispatch(
        addContextVariable({ name: propertyName, value: propertyValue }),
      );
    } else { // @todo
      console.log('updateLabelWrapper variableRenamed, node', node);
      // store.dispatch( // not used for now

      // );
    }
  }
}

export function updateLabel() {
  const delimiter = ' –– ';
  updateLabelWrapper.apply(this, [delimiter]);
}

export function updateRawLabel() {
  const delimiter = '';
  updateLabelWrapper.apply(this, [delimiter]);
}

export function addRawLabel() {
  const { node } = this.props;
  const { propertyName } = this.state;
  if (!isValidNewPropertyName(node, propertyName)) {
    return;
  }
  node.addInPort(propertyName);
}

export function updatePropertyName(event: SyntheticInputEvent<EventTarget>) {
  this.setState({ propertyName: event.target.value });
}

export function updatePropertyValue(event: SyntheticInputEvent<EventTarget>) {
  this.setState({ propertyValue: event.target.value });
}

export function updateTitleName(event: SyntheticInputEvent<EventTarget>) {
  this.setState({ name: event.target.value });
}

export function updateStateName(event: SyntheticInputEvent<EventTarget>) {
  event.preventDefault();
  const oldName = this.state.nameBeforeEditTitleClicked;
  const newName = this.state.name;
  store.dispatch(
    renameState({ oldName, newName }),
  );
}

export function updateComponentTypeName(event: SyntheticInputEvent<EventTarget>) {
  event.preventDefault();
  this.setState({ component: event.target.value });
}

export function updateComponentType(event: SyntheticInputEvent<EventTarget>) {
  event.preventDefault();
  store.dispatch(
    updateComponent({ stateName: this.state.name, componentType: event.target.value }),
  );
}

export function updateStatePropertyText(
  event: SyntheticInputEvent<EventTarget>,
  componentPropertyType: string,
) {
  event.preventDefault();
  const preservedValue = event.target.value;
  const currentPropertyText = `current${componentPropertyType}PropertyText`;
  this.setState({ [currentPropertyText]: preservedValue });
}

/**
 * @todo see updateProperty action creator + corresponding portion in representation (next to do)
 * @param {*} event 
 */
export function updateStateProperty(event: SyntheticInputEvent<EventTarget>) {
  event.preventDefault();
  console.log('updateStateProperty invoked');
  store.dispatch(
    updateProperty({
      stateName: this.state.name, transitionProperty: event.target.value,
    }),
  );
}

export function isEditing() {
  return Object.values(this.state.isEditing).reduce((prev, cur) => (prev || cur), false);
}

export function editClicked(port: any) {
  if (isEditing.apply(this)) {
    this.setState(prevState => ({
      isEditing: {
        ...prevState.isEditing,
        [port.props.name]: false,
      },
    }));
  } else {
    this.setState(prevState => ({
      isEditing: {
        ...prevState.isEditing,
        [port.props.name]: true,
      },
    }));
    const { label } = port.props.node.ports[port.props.name];
    const { type } = port.props.node;
    if (type !== 'general-component') {
      const vals = label.split('––');
      const propertyName = vals[0].trim();
      const propertyValue = vals[1].trim();
      this.setState({ propertyName, propertyValue });
    } else {
      this.setState({ propertyName: label, propertyValue: '' });
    }
  }
}

export function editTitleClicked(event: SyntheticInputEvent<EventTarget>) {
  if (this.state.isEditingTitle) {
    this.setState(prevState => ({
      isEditingTitle: false,
      nameBeforeEditTitleClicked: prevState.name,
    }));
    updateStateName.apply(this, [event]);
  } else {
    this.setState({
      isEditingTitle: true,
    });
  }
}

export function editComponentTypeClicked(event: SyntheticInputEvent<EventTarget>) {
  if (this.state.isEditingComponentType) {
    this.setState(prevState => ({
      isEditingComponentType: false,
      nameBeforeEditTitleClicked: prevState.component,
      // component: prevState.component,
    }));
    updateComponentTypeName.apply(this, [event]);
  } else {
    this.setState({
      isEditingComponentType: true,
    });
  }
}

export function addPropertyClicked(
  event: SyntheticInputEvent<EventTarget>,
  node: AdvancedNodeModel,
  componentPropertyType: string,
) {
  event.preventDefault();
  const propertyKey = `current${componentPropertyType}PropertyText`;
  if (this.state[propertyKey] !== '') {
    // this should be an out-port, but it's a fine hack for now
    node.addInPort(this.state[propertyKey]);
    store.dispatch(
      addProperty({
        stateName: this.state.name,
        propertyKey: this.state[propertyKey],
        componentPropertyType,
      }),
    );
    this.setState({ [propertyKey]: '' });
  }
}

export function generatePort(port: AdvancedPortModel) {
  // eslint-disable-next-line react/no-this-in-sfc
  const { notEditable } = this.state;
  if (typeof notEditable !== 'object' || notEditable[port.label]) {
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

export function addOrUpdateProperty(event: Event) {
  event.preventDefault(); // prevent form submission from routing browser to different path
  if (isEditing.apply(this)) {
    updateLabel.apply(this);
  } else {
    addLabel.apply(this);
  }
  clearPropertyName.apply(this);
  clearPropertyValue.apply(this);
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
}