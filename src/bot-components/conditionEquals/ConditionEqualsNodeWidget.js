// @flow
import * as React from 'react';
import { NodeModel, BaseWidget, DefaultPortLabel } from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { DefaultComponentNodeForm, DefaultComponentNodeBodyWithOneSpecialInPort } from '../../helpers/PureComponents';
import { registerNotEditable } from '../../helpers/helpers';

export interface ConditionEqualsNodeWidgetProps {
  node: AdvancedNodeModel;
}

export interface ConditionEqualsNodeWidgetState {
  representation: {
    component: 'System.ConditionEquals',
    properties: {
      variable: string,
      value: string,
    },
    transitions: {
      actions: {
        equal: string,
        notequal: string,
      },
    },
  };
  notEditable: {};
}

/**
 * @author Riyad Shauk
 */
export default class ConditionEqualsNodeWidget extends
  BaseWidget<ConditionEqualsNodeWidgetProps, ConditionEqualsNodeWidgetState> {
  static defaultProps: ConditionEqualsNodeWidgetProps = {
    node: NodeModel,
  };

  constructor(props: ConditionEqualsNodeWidgetProps) {
    super('srd-default-node', props);
    this.state = {
      propertyName: '',
      propertyValue: '',
      isEditing: {},
      prevPropertyName: '',
      notEditable: {},
      representation: {
        component: 'System.ConditionEquals',
        properties: {
          variable: '',
          value: '',
        },
        transitions: {
          actions: {
            equal: '',
            notequal: '',
          },
        },
      },
    };
  }

  generatePort = (port: any) => <DefaultPortLabel model={port} key={port.id} />

  isEditing = () => Object.values(this.state.isEditing).reduce((prev, cur) => (prev || cur), false);

  componentWillMount() {
    const { node } = this.props;
    node.addInPort(' ');
    node.addInPort('variable');
    node.addInPort('value –– ');
    node.addInPort('true');
    node.addInPort('false');

    registerNotEditable.apply(this, [' ', 'variable', 'true', 'false']);
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