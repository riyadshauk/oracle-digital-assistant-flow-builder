// @flow
import * as React from 'react';
import { DefaultNodeWidget, NodeModel } from 'storm-react-diagrams';
import ContextNodeModel from './ContextNodeModel';

export interface ContextNodeWidgetProps {
  node: ContextNodeModel;
}

export interface ContextNodeWidgetState {
  variableName: string;
}

/**
 * @author Riyad Shauk
 */
export default class ContextNodeWidget extends React.Component<ContextNodeWidgetProps,
  ContextNodeWidgetState> {
  static defaultProps: ContextNodeWidgetProps = {
    node: NodeModel,
  };

  constructor(props: ContextNodeWidgetProps) {
    super(props);
    this.state = { variableName: '' };
  }

  clearVariableName = () => this.setState({ variableName: '' });

  addVariable = (event: Event) => {
    event.preventDefault(); // prevent form submission from routing browser to different path
    const { node } = this.props;
    const { variableName } = this.state;
    if (!variableName) return; // do not allow un-named variables, here
    node.addInPort(variableName);
    this.clearVariableName();
    // @todo this may not be a correct approach: https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-calling-setstate#answer-35004739
    this.forceUpdate(); // force re-render (to fix bug when user needs to click again to re-render)
  };

  updateVariableName = (event: SyntheticInputEvent<EventTarget>) => (
    this.setState({ variableName: event.target.value })
  );

  render() {
    const { node } = this.props;
    const { variableName } = this.state;
    return (
      <div className="context-node" style={{ position: 'relative' }}>
        <form id="addVariable" onSubmit={this.addVariable}>
          <label htmlFor="addVariable">
            Variable Name &mdash;&gt;&nbsp;
            {/* NOTE: It's useful to keep value={variableName} here just so that the text can be
            cleared after the form is submitted */}
            <input type="text" value={variableName} onChange={this.updateVariableName} />
            <input type="submit" value="Add Variable" />
          </label>
        </form>
        <DefaultNodeWidget node={node} />
      </div>
    );
  }
}