// @flow
import * as React from 'react';
import { BaseWidget } from 'storm-react-diagrams';
import { registerNotEditable } from '../../helpers/helpers';
import { DefaultComponentNodeForm, DefaultComponentNodeBodyWithOneSpecialInPort } from '../../helpers/PureComponents';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import store from '../../redux/store';

export interface SystemListNodeWidgetProps {
  node: AdvancedNodeModel;
  addState: Function;
}

export interface SystemListNodeWidgetState {
  notEditable: {};
}

/**
 * @author Riyad Shauk
 */
export default class SystemListNodeWidget extends
  BaseWidget<SystemListNodeWidgetProps, SystemListNodeWidgetState> {
  constructor(props: SystemListNodeWidgetProps) {
    super('srd-default-node', props);
    this.state = {
      propertyName: '',
      propertyValue: '',
      isEditing: {},
      prevPropertyName: '',
      notEditable: {},
      representation: {
        component: 'System.List',
        properties: {
          from: '',
          to: '',
        },
        transitions: {
          next: '',
        },
      },
      name: '',
    };
    const { addState, node } = props;
    const { id } = node;
    const stateNamePrefix = 'List';
    addState(this.state.representation, stateNamePrefix, id);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentWillMount() {
    const { node } = this.props;
    node.addInPort('IN');
    node.addOutPort('OUT');
    node.addInPort('variable');
    registerNotEditable.apply(this, ['IN', 'OUT', 'variable']);
    node.addInPort('prompt –– ');
    node.addInPort('options –– ');
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
        { DefaultComponentNodeForm.apply(this, [this]) }
        { DefaultComponentNodeBodyWithOneSpecialInPort.apply(this, [node, this]) }
      </div>
    );
  }
}