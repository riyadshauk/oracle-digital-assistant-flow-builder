// @flow
import * as React from 'react';
import * as _ from 'lodash';
import { NodeModel, BaseWidget } from 'storm-react-diagrams';
import {
  updatePropertyName,
  updatePropertyValue,
  isEditing,
  addOrUpdateProperty,
  generatePort,
} from './helpers';
import {
  type ContextVariable,
} from '../redux/representationTypes';

export const DefaultComponentNodeForm = (thisWidget: BaseWidget) => {
  const { propertyName, propertyValue } = thisWidget.state;
  return (
    <form id="addVariable" onSubmit={addOrUpdateProperty.bind(thisWidget)}>
      <label htmlFor="addOrUpdateProperty">
        Name:&nbsp;
        <input type="text" value={propertyName} onChange={updatePropertyName.bind(thisWidget)} />
        <br />
        Value:&nbsp;
        <input type="text" value={propertyValue} onChange={updatePropertyValue.bind(thisWidget)} />
        <br />
        <input
          type="submit"
          value={isEditing.apply(thisWidget) ? 'Save Edits' : 'Add Property'}
        />
      </label>
    </form>
  );
};

export const VariableNameComponentNodeForm = (thisWidget: BaseWidget,
  addContextVariable?: ({ name: string, entityType: string }) => void,
  renameContextVariable?: ({ prev: ContextVariable, cur: ContextVariable }) => void) => {
  const { propertyName, propertyValue } = thisWidget.state;
  return (
    <form id="addVariable" onSubmit={(event: Event) => addOrUpdateProperty.apply(thisWidget, [event, addContextVariable, renameContextVariable])}>
      <label htmlFor="addOrUpdateProperty">
        Name:&nbsp;
        <input type="text" value={propertyName} onChange={updatePropertyName.bind(thisWidget)} />
        <br />
        EntityType:&nbsp;
        <input type="text" value={propertyValue} onChange={updatePropertyValue.bind(thisWidget)} />
        <br />
        <input
          type="submit"
          value={isEditing.apply(thisWidget) ? 'Save Edits' : 'Add Property'}
        />
      </label>
    </form>
  );
};

export const DefaultComponentNodeBody = (node: NodeModel, thisWidget: BaseWidget) => (
  <div {...thisWidget.getProps()} style={{ background: node.color }}>
    <div className={thisWidget.bem('__title')}>
      <div className={thisWidget.bem('__name')}>{thisWidget.state.name}</div>
    </div>
    <div className={thisWidget.bem('__title')}>
      <div className={thisWidget.bem('__name')}>{node.name}</div>
    </div>
    <div className={thisWidget.bem('__ports')}>
      <div className={thisWidget.bem('__in')}>
        {_.map(node.getInPorts(), generatePort.bind(thisWidget))}
      </div>
      <div className={thisWidget.bem('__out')}>
        {_.map(node.getOutPorts(), generatePort.bind(thisWidget))}
      </div>
    </div>
  </div>
);

export const DefaultComponentNodeBodyWithOneSpecialInPort = (node: NodeModel,
  thisWidget: BaseWidget) => (
    <div {...thisWidget.getProps()} style={{ background: node.color }}>
      <div className={thisWidget.bem('__title')}>
        <div className={thisWidget.bem('__name')}>{thisWidget.state.name}</div>
      </div>
      <div className={thisWidget.bem('__title')}>
        <div className={thisWidget.bem('__name')}>{node.name}</div>
        <div className={thisWidget.bem('__in')}>
          {/* {thisWidget.generatePort.apply(thisWidget, [node.getInPorts()[0]])} */}
          {_.map(node.getInPorts(), generatePort.bind(thisWidget))[0]}
        </div>
      </div>
      <div className={thisWidget.bem('__ports')}>
        <div className={thisWidget.bem('__in')}>
          {_.map(node.getInPorts(), generatePort.bind(thisWidget)).slice(1)}
        </div>
        <div className={thisWidget.bem('__out')}>
          {_.map(node.getOutPorts(), generatePort.bind(thisWidget))}
        </div>
      </div>
    </div>
);