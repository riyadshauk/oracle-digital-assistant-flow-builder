// @flow
import * as React from 'react';
import { NodeModel, BaseWidget } from 'storm-react-diagrams';
import { registerNotEditable } from '../helpers/helpers';
import { DefaultComponentNodeForm, DefaultComponentNodeBody } from '../helpers/PureComponents';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export interface SystemListNodeWidgetProps {
  node: AdvancedNodeModel;
}

export interface SystemListNodeWidgetState {
  notEditable: {};
}

/**
 * @author Riyad Shauk
 */
export default class SystemListNodeWidget extends
  BaseWidget<SystemListNodeWidgetProps, SystemListNodeWidgetState> {
  static defaultProps: SystemListNodeWidgetProps = {
    node: NodeModel,
  };

  constructor(props: SystemListNodeWidgetProps) {
    super('srd-default-node', props);
    this.state = {
      propertyName: '',
      propertyValue: '',
      isEditing: {},
      prevPropertyName: '',
      notEditable: {},
    };
  }

  componentWillMount() {
    const { node } = this.props;
    node.addInPort('variable');
    registerNotEditable.apply(this, ['variable']);
  }

  render() {
    const { node } = this.props;
    return (
      <div className="default-component-node" style={{ position: 'relative' }}>
        { DefaultComponentNodeForm.apply(this, [this]) }
        { DefaultComponentNodeBody.apply(this, [node, this]) }
      </div>
    );
  }
}