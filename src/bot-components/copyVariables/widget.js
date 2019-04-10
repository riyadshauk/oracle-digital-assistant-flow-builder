// @flow
import * as React from 'react';
import { BaseWidget } from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { registerNotEditable } from '../../helpers/helpers';
import { DefaultComponentNodeForm, DefaultComponentNodeBodyWithOneSpecialInPort } from '../../helpers/FunctionalComponents';
import store from '../../redux/store';

export interface CopyVariablesNodeWidgetProps {
  node: AdvancedNodeModel;
  addState: Function;
}

export interface CopyVariablesNodeWidgetState {
  notEditable: {};
}

/**
 * @author Riyad Shauk
 */
export default class CopyVariablesNodeWidget extends
  BaseWidget<CopyVariablesNodeWidgetProps, CopyVariablesNodeWidgetState> {
  constructor(props: CopyVariablesNodeWidgetProps) {
    super('srd-default-node', props);
    this.state = {
      propertyName: '',
      propertyValue: '',
      isEditing: {},
      prevPropertyName: '',
      notEditable: {},
      representation: {
        component: 'System.CopyVariables',
        properties: {
          from: '',
          to: '',
        },
        transitions: {
          next: '',
        },
      },
      name: '',
      isEditingTitle: false,
      nameBeforeEditTitleClicked: '',
    };
    const { addState, node } = props;
    const { id } = node;
    const stateNamePrefix = 'CopyVariables';
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
    registerNotEditable.apply(this, ['IN', 'OUT']);
    node.addInPort('from –– ');
    node.addInPort('to –– ');
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
        {DefaultComponentNodeForm.apply(this, [this])}
        {DefaultComponentNodeBodyWithOneSpecialInPort.apply(this, [node, this])}
      </div>
    );
  }
}