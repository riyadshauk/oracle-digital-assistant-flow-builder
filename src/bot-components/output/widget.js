// @flow
import * as React from 'react';
import { BaseWidget } from 'storm-react-diagrams';
import { Resizable } from 're-resizable';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { registerNotEditable } from '../../helpers/helpers';
import { DefaultComponentNodeForm, DefaultComponentNodeBodyWithOneSpecialInPort } from '../../helpers/FunctionalComponents';
import store from '../../redux/store';

export interface OutputNodeWidgetProps {
  node: AdvancedNodeModel;
  addState: Function;
}

export interface OutputNodeWidgetState {
  notEditable: {};
}

/**
 * @author Riyad Shauk
 */
export default class OutputNodeWidget extends
  BaseWidget<OutputNodeWidgetProps, OutputNodeWidgetState> {
  constructor(props: OutputNodeWidgetProps) {
    super('srd-default-node', props);
    this.state = {
      propertyName: '',
      propertyValue: '',
      isEditing: {},
      prevPropertyName: '',
      notEditable: {},
      representation: {
        component: 'System.Output',
        properties: {
          text: '',
        },
        transitions: {
          return: '',
        },
      },
      name: '',
      isEditingTitle: false,
      nameBeforeEditTitleClicked: '',
    };
    const { addState, node } = props;
    const { id } = node;
    const stateNamePrefix = node.name || 'Output';
    addState(this.state.representation, stateNamePrefix, id);
    this.state.name = store.getState().representation.idToName[node.id];
    this.state.nameBeforeEditTitleClicked = this.state.name;
  }

  componentWillMount() {
    const { node } = this.props;
    node.addInPort('IN');
    node.addOutPort('OUT');
    registerNotEditable.apply(this, ['IN', 'OUT']);
    node.addInPort('text –– ');
  }

  componentWillUnmount() {
    this.unsubscribe();
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
      <Resizable>
        <div className="default-component-node" style={{ position: 'relative' }}>
          {DefaultComponentNodeForm.apply(this, [this])}
          {DefaultComponentNodeBodyWithOneSpecialInPort.apply(this, [node, this])}
        </div>
      </Resizable>
    );
  }
}