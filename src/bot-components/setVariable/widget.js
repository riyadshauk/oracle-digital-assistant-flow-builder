// @flow
import * as React from 'react';
import { BaseWidget } from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { registerNotEditable } from '../../helpers/helpers';
import { DefaultComponentNodeForm, DefaultComponentNodeBodyWithOneSpecialInPort } from '../../helpers/FunctionalComponents';
import store from '../../redux/store';

export interface SetVariableNodeWidgetProps {
  node: AdvancedNodeModel;
  addState: Function;
}

export interface SetVariableNodeWidgetState {
  notEditable: {};
}

/**
 * @author Riyad Shauk
 */
export default class SetVariableNodeWidget extends
  BaseWidget<SetVariableNodeWidgetProps, SetVariableNodeWidgetState> {
  constructor(props: SetVariableNodeWidgetProps) {
    super('srd-default-node', props);
    this.state = {
      propertyName: '',
      propertyValue: '',
      isEditing: {},
      prevPropertyName: '',
      notEditable: {},
      representation: {
        component: 'System.SetVariable',
        properties: {
          variable: '',
          value: '',
        },
        transitions: {
          next: '',
        },
      },
      name: '',
      isEditingTitle: false,
      nameBeforeEditTitleClicked: '',
    };
    const { addState, node } = this.props;
    const { id } = node;
    const stateNamePrefix = 'SetVariable';
    addState(this.state.representation, stateNamePrefix, id);
    this.state.name = store.getState().representation.idToName[node.id];
    this.state.nameBeforeEditTitleClicked = this.state.name;
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
    node.addInPort('value –– ');
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