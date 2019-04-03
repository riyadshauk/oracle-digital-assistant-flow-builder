// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { NodeModel, BaseWidget } from 'storm-react-diagrams';
import { addContextVariable } from '../../redux/actions';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { DefaultComponentNodeBody, VariableNameComponentNodeForm } from '../../helpers/PureComponents';

export interface ContextNodeWidgetProps {
  node: AdvancedNodeModel;
  addContextVariable: typeof addContextVariable;
}

export interface ContextNodeWidgetState {
  propertyName: string;
  propertyValue: string;
  isEditing: boolean;
  prevPropertyName: string;
  notEditable: {};
}

/**
 * @author Riyad Shauk
 */
class ContextNodeWidget extends BaseWidget<ContextNodeWidgetProps,
  ContextNodeWidgetState> {
  static defaultProps: ContextNodeWidgetProps = {
    node: NodeModel,
    addContextVariable,
  };

  constructor(props: ContextNodeWidgetProps) {
    super('srd-default-node', props);
    this.state = {
      propertyName: '',
      propertyValue: '',
      isEditing: {},
      prevPropertyName: '',
      notEditable: {},
    };
  }

  render() {
    const { node } = this.props;
    return (
      <div className="default-component-node" style={{ position: 'relative' }}>
        { VariableNameComponentNodeForm.apply(this, [this]) }
        { DefaultComponentNodeBody.apply(this, [node, this]) }
      </div>
    );
  }
}

export default connect(
  null,
  { addContextVariable },
)(ContextNodeWidget);