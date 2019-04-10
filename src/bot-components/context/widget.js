// @flow
import * as React from 'react';
import {
  BaseWidget,
} from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { DefaultComponentNodeBody, VariableNameComponentNodeForm } from '../../helpers/FunctionalComponents';

export interface ContextNodeWidgetProps {
  node: AdvancedNodeModel;
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
export default class ContextNodeWidget extends BaseWidget<ContextNodeWidgetProps,
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
    const { node } = this.props;
    return (
      <div className="default-component-node" style={{ position: 'relative' }}>
        {
          VariableNameComponentNodeForm
            .apply(this, [this])
        }
        {DefaultComponentNodeBody.apply(this, [node, this])}
      </div>
    );
  }
}