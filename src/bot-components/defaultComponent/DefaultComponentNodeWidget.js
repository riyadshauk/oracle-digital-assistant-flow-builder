// @flow
import * as React from 'react';
import { NodeModel, BaseWidget } from 'storm-react-diagrams';
import { DefaultComponentNodeForm, DefaultComponentNodeBodyWithOneSpecialInPort } from '../../helpers/PureComponents';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { registerNotEditable } from '../../helpers/helpers';

export interface DefaultComponentNodeWidgetProps {
  node: AdvancedNodeModel;
}

export interface DefaultComponentNodeWidgetState {
  propertyName: string;
  propertyValue: string;
  isEditing: boolean;
  prevPropertyName: string;
  notEditable: {};
}

/**
 * @author Riyad Shauk
 */
export default class DefaultComponentNodeWidget extends
  BaseWidget<DefaultComponentNodeWidgetProps, DefaultComponentNodeWidgetState> {
  static defaultProps: DefaultComponentNodeWidgetProps = {
    node: NodeModel,
  };

  constructor(props: DefaultComponentNodeWidgetProps) {
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
    node.addInPort(' ');
    registerNotEditable.apply(this, [' ']);
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