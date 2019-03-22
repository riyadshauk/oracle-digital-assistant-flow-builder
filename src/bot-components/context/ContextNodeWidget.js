// @flow
import * as React from 'react';
import { DefaultNodeWidget, NodeModel } from 'storm-react-diagrams';
import ContextNodeModel from './ContextNodeModel';

export interface ContextNodeWidgetProps {
  node: ContextNodeModel;
}

export interface ContextNodeWidgetState {}

/**
 * @author Dylan Vorster
 */
export default class ContextNodeWidget extends React.Component<ContextNodeWidgetProps,
  ContextNodeWidgetState> {
  static defaultProps: ContextNodeWidgetProps = {
    node: NodeModel,
  };

  addVariable = () => {
    const { node } = this.props;
    node.addInPort('another variable');
  };

  render() {
    console.log('ContextNodeWidget rendering');
    const { node } = this.props;
    return (
      <div
        className="context-node"
        style={{
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={this.addVariable}
        >
          Add Variable
        </button>
        <DefaultNodeWidget node={node} />
      </div>
    );
  }
}