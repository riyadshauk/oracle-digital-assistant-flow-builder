// @flow
import * as React from 'react';
import * as _ from 'lodash';
import { NodeModel, BaseWidget } from 'storm-react-diagrams';
import DefaultComponentNodeModel from './DefaultComponentNodeModel';
import DefaultComponentPortLabel from './DefaultComponentPortLabel';

export interface DefaultComponentNodeWidgetProps {
  node: DefaultComponentNodeModel;
}

export interface DefaultComponentNodeWidgetState {
  propertyName: string;
  propertyValue: string;
  isEditing: boolean;
  prevPropertyName: string;
}

/**
 * @author Riyad Shauk
 */
export default class DefaultComponentNodeWidget extends
  BaseWidget<DefaultComponentNodeWidgetProps, DefaultComponentNodeWidgetState> {
  static defaultProps: DefaultComponentNodeWidgetProps = {
    node: NodeModel,
  };

  constructor(props: DefaultComponentNodeWidgetProps) {
    super('srd-default-node', props);
    this.state = {
      propertyName: '',
      propertyValue: '',
      isEditing: {},
      prevPropertyName: '',
    };
  }

  clearPropertyName = () => this.setState({ propertyName: '' });

  clearPropertyValue = () => this.setState({ propertyValue: '' });

  addOrUpdateProperty = (event: Event) => {
    event.preventDefault(); // prevent form submission from routing browser to different path
    if (this.isEditing()) {
      this.updateLabel();
    } else {
      this.addLabel();
    }
    this.clearPropertyName();
    this.clearPropertyValue();
    // @todo this may not be a correct approach: https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-calling-setstate#answer-35004739
    this.forceUpdate(); // force re-render (to fix bug when user needs to click again to re-render)
  };

  addLabel = () => {
    const { node } = this.props;
    const { propertyName, propertyValue } = this.state;
    if (!propertyName) return; // do not allow un-named variables, here
    node.addInPort(`${propertyName} –– ${propertyValue}`);
  };

  updateLabel = () => {
    const { node } = this.props;
    const { propertyName, propertyValue, prevPropertyName } = this.state;
    if (!propertyName) return; // do not allow un-named variables, here
    const ports = node.getInPorts();
    const re = RegExp(`${prevPropertyName} –– `, 'g');
    for (let i = 0; i < ports.length; i += 1) {
      const portName = ports[i].label;
      const occurrences = portName.match(re);
      if (occurrences !== undefined && occurrences && occurrences.length === 1) {
        ports[i].label = `${propertyName} –– ${propertyValue}`;
        this.state.isEditing[ports[i].name] = false;
        break;
      }
    }
  };

  updatePropertyName = (event: SyntheticInputEvent<EventTarget>) => (
    this.setState({ propertyName: event.target.value })
  );

  updatePropertyValue = (event: SyntheticInputEvent<EventTarget>) => (
    this.setState({ propertyValue: event.target.value })
  );

  editClicked = (port: any) => {
    if (this.isEditing()) {
      this.state.isEditing[port.props.name] = false;
    } else {
      this.state.isEditing[port.props.name] = true;
      this.setState(prevState => ({ prevPropertyName: prevState.propertyName }));
    }
  };

  generatePort = (port: any) => (
    <DefaultComponentPortLabel
      model={port}
      key={port.id}
      editClicked={this.editClicked}
      isEditing={this.state.isEditing[port.name]}
    />
  );

  isEditing = () => {
    const { isEditing } = this.state;
    const vals = Object.values(isEditing);
    let acc = false;
    vals.forEach((val) => {
      acc = acc || val;
    });
    return acc;
  }

  render() {
    const { node } = this.props;
    const { propertyName, propertyValue } = this.state;
    return (
      <div className="default-component-node" style={{ position: 'relative' }}>

        <form id="addVariable" onSubmit={this.addOrUpdateProperty}>
          <label htmlFor="addOrUpdateProperty">
            Name:&nbsp;
            {/* NOTE: It's useful to keep value={...} here just so that the text can be
            cleared after the form is submitted */}
            <input type="text" value={propertyName} onChange={this.updatePropertyName} />
            <br />
            Value:&nbsp;
            <input type="text" value={propertyValue} onChange={this.updatePropertyValue} />
            <br />
            <input
              type="submit"
              value={this.isEditing() ? 'Save Edits' : 'Add Property'}
            />
          </label>
        </form>

        {/* <DefaultNodeWidget node={node} /> */}
        <div {...this.getProps()} style={{ background: node.color }}>
          <div className={this.bem('__title')}>
            <div className={this.bem('__name')}>{node.name}</div>
          </div>
          <div className={this.bem('__ports')}>
            <div className={this.bem('__in')}>
              {_.map(node.getInPorts(), this.generatePort)}
            </div>
            <div className={this.bem('__out')}>
              {_.map(node.getOutPorts(), this.generatePort)}
            </div>
          </div>
        </div>

      </div>
    );
  }
}