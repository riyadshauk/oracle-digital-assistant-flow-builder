// @flow
import * as React from 'react';
import {
  BaseWidget,
} from 'storm-react-diagrams';
import {
  addContextVariable,
  renameContextVariable,
} from '../../redux/actions';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { DefaultComponentNodeBody, VariableNameComponentNodeForm } from '../../helpers/PureComponents';

export interface ContextNodeWidgetProps {
  node: AdvancedNodeModel;
  addContextVariable: typeof addContextVariable;
  renameContextVariable: typeof renameContextVariable;
}

export interface ContextNodeWidgetState {
  propertyName: string;
  propertyValue: string;
  isEditing: boolean;
  prevPropertyName: string;
  notEditable: {};
  representation: {
    context: {
      variables: {
        [key: string]: string,
      },
    },
  };
}

/**
 * @author Riyad Shauk
 */
export default class extends BaseWidget<ContextNodeWidgetProps,
  ContextNodeWidgetState> {
  constructor(props: ContextNodeWidgetProps) {
    super('srd-default-node', props);
    this.state = {
      propertyName: '',
      propertyValue: '',
      isEditing: {},
      prevPropertyName: '',
      notEditable: {},
      representation: {
        context: {
          variables: {},
        },
      },
    };
  }

  render() {
    const { node, addContextVariable, renameContextVariable } = this.props;
    return (
      <div className="default-component-node" style={{ position: 'relative' }}>
        {
          VariableNameComponentNodeForm
            .apply(this, [this, addContextVariable, renameContextVariable])
        }
        {DefaultComponentNodeBody.apply(this, [node, this])}
      </div>
    );
  }
}