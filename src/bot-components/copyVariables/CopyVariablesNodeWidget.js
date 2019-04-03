// @flow
import * as React from 'react';
import { NodeModel, BaseWidget, DefaultPortLabel } from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { registerNotEditable } from '../../helpers/helpers';
import { DefaultComponentNodeForm, DefaultComponentNodeBodyWithOneSpecialInPort } from '../../helpers/PureComponents';

export interface CopyVariablesNodeWidgetProps {
  node: AdvancedNodeModel;
}

export interface CopyVariablesNodeWidgetState {
  notEditable: {};
}

/**
 * @author Riyad Shauk
 */
export default class CopyVariablesNodeWidget extends
  BaseWidget<CopyVariablesNodeWidgetProps, CopyVariablesNodeWidgetState> {
  static defaultProps: CopyVariablesNodeWidgetProps = {
    node: NodeModel,
  };

  constructor(props: CopyVariablesNodeWidgetProps) {
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
    node.addInPort(' ');
    registerNotEditable.apply(this, [' ']);
    node.addInPort('from –– ');
    node.addInPort('to –– ');
  }

  render() {
    const { node } = this.props;
    return (
      <div className="default-component-node" style={{ position: 'relative' }}>
        { DefaultComponentNodeForm.apply(this, [this]) }
        { DefaultComponentNodeBodyWithOneSpecialInPort.apply(this, [node, this]) }
      </div>
    );
  }
}