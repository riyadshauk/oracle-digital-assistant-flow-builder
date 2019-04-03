// @flow
import * as React from 'react';
import { BaseWidget, BaseWidgetProps, PortWidget } from 'storm-react-diagrams';
import { AdvancedPortModel } from '../AdvancedDiagramFactories';

export interface DefaultComponentPortLabelProps extends BaseWidgetProps {
  model: AdvancedPortModel;
  editClicked: Function;
}

export interface DefaultComponentPortLabelState { }

/**
 * @author Dylan Vorster
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
    const port = <PortWidget node={model.getParent()} name={model.name} />;
    const label = <div className="name">{model.label}</div>;

    return (
      <div {...this.getProps()}>
        {model.in ? port : label}
        {model.in ? label : port}
        {/* add Edit button here */}
        <button
          type="button"
          // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
          onClick={() => this.props.editClicked(port)}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>
    );
  }
}
