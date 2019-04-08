// @flow
import * as React from 'react';
import {
  BaseWidget,
} from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { DefaultComponentNodeBodyWithOneSpecialInPort } from '../../helpers/PureComponents';
import store from '../../redux/store';

export interface ConditionExistsNodeWidgetProps {
  node: AdvancedNodeModel;
  addState: Function;
}

export interface ConditionExistsNodeWidgetState {
  representation: {
    component: 'System.ConditionExists',
    properties: {
      variable: string,
    },
    transitions: {
      actions: {
        exists: string,
        notexists: string,
      },
    },
  },
  name: string,
}

/**
 * @author Riyad Shauk
 */
export default class extends
  BaseWidget<ConditionExistsNodeWidgetProps, ConditionExistsNodeWidgetState> {
  constructor(props: ConditionExistsNodeWidgetProps) {
    super('srd-default-node', props);
    this.state = {
      representation: {
        component: 'System.ConditionExists',
        properties: {
          variable: '',
        },
        transitions: {
          actions: {
            exists: '',
            notexists: '',
          },
        },
      },
      name: '',
    };
    const { addState, node } = props;
    const { id } = node;
    const stateNamePrefix = 'Exists';
    addState(this.state.representation, stateNamePrefix, id);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentWillMount() {
    const { node } = this.props;
    node.addInPort('IN');
    node.addInPort('variable');
    node.addInPort('true');
    node.addInPort('false');
  }

  componentDidMount() {
    const { node } = this.props;
    this.unsubscribe = store.subscribe(() => {
      this.setState({ name: store.getState().representation.idToName[node.id] });
    });
  }

  render() {
    const { node } = this.props;
    return (
      <div className="default-component-node" style={{ position: 'relative' }}>
        {DefaultComponentNodeBodyWithOneSpecialInPort.apply(this, [node, this])}
      </div>
    );
  }
}