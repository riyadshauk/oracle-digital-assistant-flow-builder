// @flow
import * as React from 'react';
import { BaseWidget } from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { registerNotEditable } from '../../helpers/helpers';
import { DefaultComponentNodeForm, DefaultComponentNodeBodyWithOneSpecialInPort } from '../../helpers/PureComponents';

export interface SystemOutputNodeWidgetProps {
  node: AdvancedNodeModel;
  addState: Function;
}

export interface SystemOutputNodeWidgetState {
  notEditable: {};
}

/**
 * @author Riyad Shauk
 */
export default class SystemOutputNodeWidget extends
  BaseWidget<SystemOutputNodeWidgetProps, SystemOutputNodeWidgetState> {
  constructor(props: SystemOutputNodeWidgetProps) {
    super('srd-default-node', props);
    this.state = {
      propertyName: '',
      propertyValue: '',
      isEditing: {},
      prevPropertyName: '',
      notEditable: {},
      representation: {
        component: 'System.Output',
        properties: {
          text: '',
        },
        transitions: {
          next: '',
        },
      },
    };
    const { addState, node } = props;
    const { id } = node;
    const newStateName = 'System.Output.Name';
    addState(this.state.representation, newStateName, id);
  }

  isEditing = () => Object.values(this.state.isEditing).reduce((prev, cur) => (prev || cur), false);

  componentWillMount() {
    const { node } = this.props;
    node.addInPort('IN');
    node.addOutPort('OUT');
    registerNotEditable.apply(this, ['IN', 'OUT']);
    node.addInPort('text –– ');
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