// @flow
import * as React from 'react';
import {
  BaseWidget,
} from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { DefaultComponentNodeBody, VariableNameComponentNodeForm } from '../../helpers/FunctionalComponents';

export interface SystemVariablesNodeWidgetProps {
  node: AdvancedNodeModel;
}

export interface SystemVariablesNodeWidgetState {
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
export default class SystemVariablesNodeWidget extends BaseWidget<SystemVariablesNodeWidgetProps,
  SystemVariablesNodeWidgetState> {
  constructor(props: SystemVariablesNodeWidgetProps) {
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
        {VariableNameComponentNodeForm.apply(this, [this])}
        {DefaultComponentNodeBody.apply(this, [node, this])}
      </div>
    );
  }
}