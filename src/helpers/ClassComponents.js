// @flow
import * as React from 'react';
import { BaseWidget, BaseWidgetProps, PortWidget } from 'storm-react-diagrams';
import { AdvancedPortModel } from '../AdvancedDiagramFactories';
import { definedSystemNodeTypes } from './constants';

export interface DefaultComponentPortLabelProps extends BaseWidgetProps {
  model: AdvancedPortModel;
  editClicked: Function;
  removeClicked: Function;
}

export interface DefaultComponentPortLabelState { }

/**
 * @author Dylan Vorster
 * @author Riyad Shauk
 */
// eslint-disable-next-line import/prefer-default-export
export class DefaultComponentPortLabel extends
  BaseWidget<DefaultComponentPortLabelProps, DefaultComponentPortLabelState> {
  constructor(props: DefaultComponentPortLabelProps) {
    super('srd-default-port', props);
  }

  getClassName() {
    return super.getClassName() + (this.props.model.in ? this.bem('--in') : this.bem('--out'));
  }

  render() {
    const { model, isEditing } = this.props;
    const node = model.getParent();
    const port = (
      <PortWidget
        node={node}
        name={model.name}
      />
    );
    const label = <div className="name">{model.label}</div>;

    let buttonText = isEditing ? 'Cancel' : 'Edit Value';
    if (!definedSystemNodeTypes.has(model.parent.type) && model.label.indexOf('––') === -1) {
      buttonText = false;
    }

    let editButton = (
      <button
        type="button"
        // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
        onClick={() => this.props.editClicked(port)}
      >
        {buttonText}
      </button>
    );
    if (!buttonText) {
      editButton = undefined;
    }

    let removeButton = (
      <button
        type="button"
        // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
        onClick={() => this.props.removeClicked(port)}
      >
        Remove
      </button>
    );
    if (definedSystemNodeTypes.has(node.type)) {
      removeButton = undefined;
    }

    return (
      <div {...this.getProps()}>
        {model.in ? port : label}
        {model.in ? label : port}
        {/* add Edit button here */}
        {editButton}
        {removeButton}
      </div>
    );
  }
}
