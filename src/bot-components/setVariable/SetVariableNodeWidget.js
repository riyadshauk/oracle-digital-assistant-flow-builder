// @flow
import * as React from 'react';
import { NodeModel, BaseWidget, DefaultPortLabel } from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { registerNotEditable } from '../../helpers/helpers';
import { DefaultComponentNodeForm, DefaultComponentNodeBodyWithOneSpecialInPort } from '../../helpers/PureComponents';

export interface SetVariableNodeWidgetProps {
  node: AdvancedNodeModel;
}

export interface SetVariableNodeWidgetState {
  notEditable: {};
}

/**
 * @author Riyad Shauk
 */
export default class SetVariableNodeWidget extends
  BaseWidget<SetVariableNodeWidgetProps, SetVariableNodeWidgetState> {
  static defaultProps: SetVariableNodeWidgetProps = {
    node: NodeModel,
  };

  constructor(props: SetVariableNodeWidgetProps) {
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
    node.addInPort('variable');
    registerNotEditable.apply(this, [' ', 'variable']);
    node.addInPort('value –– ');
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