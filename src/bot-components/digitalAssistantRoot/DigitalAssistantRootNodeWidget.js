// @flow
import * as React from 'react';
import { NodeModel, BaseWidget, DefaultPortLabel } from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { registerNotEditable } from '../../helpers/helpers';
import { DefaultComponentNodeBodyWithOneSpecialInPort } from '../../helpers/PureComponents';

export interface IntentNodeWidgetProps {
  node: AdvancedNodeModel;
}

export interface IntentNodeWidgetState {
  notEditable: {};
}

/**
 * @author Riyad Shauk
 */
export default class IntentNodeWidget extends
  BaseWidget<IntentNodeWidgetProps, IntentNodeWidgetState> {
  static defaultProps: IntentNodeWidgetProps = {
    node: NodeModel,
  };

  constructor(props: IntentNodeWidgetProps) {
    super('srd-default-node', props);
    this.state = {
      propertyName: '',
      propertyValue: '',
      isEditing: {},
      prevPropertyName: '',
      notEditable: {},
    };
  }

  generatePort = (port: any) => <DefaultPortLabel model={port} key={port.id} />

  isEditing = () => Object.values(this.state.isEditing).reduce((prev, cur) => (prev || cur), false);

  componentWillMount() {
    const { node } = this.props;
    node.addOutPort('Out');
    registerNotEditable.apply(this, ['Out']);
  }

  render() {
    const { node } = this.props;
    return (
      <div className="default-component-node" style={{ position: 'relative' }}>
        { DefaultComponentNodeBodyWithOneSpecialInPort.apply(this, [node, this]) }
      </div>
    );
  }
}