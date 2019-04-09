// @flow
import * as React from 'react';
import {
  DefaultPortLabel,
  NodeModel,
} from 'storm-react-diagrams';
import { DefaultComponentPortLabel } from './ClassComponents';
import {
  addContextVariable, renameContextVariable, renameVariableValue, renameState, updateComponent,
} from '../redux/actions';
import store from '../redux/store';

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

export function updateLabel() {
  const { node } = this.props;
  const { propertyName, propertyValue } = this.state;
  if (!propertyName) {
    return; // do not allow un-named variables, here
  }
  const ports = node.getInPorts();
  const re = RegExp(`${propertyName} –– `, 'g');
  let variableRenamed = false;
  ports.forEach((port) => {
    const portName = port.label;
    const occurrences = portName.match(re);
    if (occurrences !== undefined && occurrences && occurrences.length === 1) {
      variableRenamed = true;
      const prevVals = portName.split(' –– ');
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

      port.label = `${propertyName} –– ${propertyValue}`;
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
      // store.dispatch( // not used for now

      // );
    }
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
  ports.forEach((port) => {
    const portName = port.label;
    const occurrences = portName.match(re);
    if (occurrences !== undefined && occurrences && occurrences.length === 1) {
      port.label = propertyName;
      this.setState(prevState => ({
        isEditing: {
          ...prevState.isEditing,
          [port.name]: false,
        },
      }));
      // break;
    }
  });
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
    updateComponent({ stateName: this.state.name, componentType: this.state.component }),
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

    this.forceUpdate();
  } else {
    this.setState(prevState => ({
      isEditing: {
        ...prevState.isEditing,
        [port.props.name]: true,
      },
    }));
    const { label } = port.props.node.ports[port.props.name];
    const vals = label.split('––');
    const propertyName = vals[0].trim();
    const propertyValue = vals[1].trim();
    this.setState({ propertyName, propertyValue });
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
    }));
    updateComponentTypeName.apply(this, [event]);
  } else {
    this.setState({
      isEditingComponentType: true,
    });
  }
}

export function generatePort(port: any) {
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