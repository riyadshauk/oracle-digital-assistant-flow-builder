// @flow
import * as React from 'react';
import {
  BaseWidget,
} from 'storm-react-diagrams';
import { Resizable } from 're-resizable';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { DefaultComponentNodeBody, VariableNameComponentNodeForm } from '../../helpers/FunctionalComponents';

export interface ParametersNodeWidgetProps {
  node: AdvancedNodeModel;
}

export interface ParametersNodeWidgetState {
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
export default class ParametersNodeWidget extends BaseWidget<ParametersNodeWidgetProps,
  ParametersNodeWidgetState> {
  constructor(props: ParametersNodeWidgetProps) {
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
      <Resizable>
        <div className="default-component-node" style={{ position: 'relative' }}>
          {VariableNameComponentNodeForm.apply(this, [this])}
          {DefaultComponentNodeBody.apply(this, [node, this])}
        </div>
      </Resizable>
    );
  }
}