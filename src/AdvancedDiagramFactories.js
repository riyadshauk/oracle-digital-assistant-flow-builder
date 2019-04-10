// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import * as _ from 'lodash';
import {
  DefaultPortModel, DefaultLinkWidget,
  DiagramEngine, Toolkit, NodeModel, NodeModelListener,
  BaseEvent,
  DefaultLinkFactory,
} from 'storm-react-diagrams';
import ModifiedDefaultLinkModel from './base-components/ModifiedDefaultLinkModel';

// https://github.com/projectstorm/react-diagrams/issues/325 : Changing Link Color
export class AdvancedLinkModel extends ModifiedDefaultLinkModel {
  constructor() {
    super('advanced');
    this.color = 'rgba(0,0,0,0.5)';
    const { color } = this;
    this.iterateListeners((listener: any, event: BaseEvent) => {
      if (listener.colorChanged) {
        listener.colorChanged({ ...event, color });
      }
    });
  }
}

export class AdvancedPortModel extends DefaultPortModel {
  createLinkModel(): AdvancedLinkModel {
    return new AdvancedLinkModel();
  }

  canLinkToPort(targetPort: AdvancedPortModel) {
    if (this === targetPort || this.parent.type === 'context') {
      return false;
    }
    return true;
  }
}

export class AdvancedLinkFactory extends DefaultLinkFactory {
  constructor() {
    super();
    this.type = 'advanced';
  }

  getNewInstance(): AdvancedLinkModel {
    return new AdvancedLinkModel();
  }

  generateLinkSegment(model: AdvancedLinkModel, widget: DefaultLinkWidget,
    selected: boolean, path: string) {
    return (
      <path
        className={selected ? widget.bem('--path-selected') : ''}
        strokeWidth={model.width}
        stroke={model.color}
        d={path}
      />
    );
  }
}

export class AdvancedNodeModel extends NodeModel<NodeModelListener> {
  name: string;

  color: string;

  ports: { [s: string]: AdvancedPortModel };

  constructor(name: string = 'Untitled', color: string = 'rgb(0,192,255)', type: string = 'default') {
    super(type);
    this.name = name;
    this.color = color;
  }

  addInPort(label: string): AdvancedPortModel {
    return this.addPort(new AdvancedPortModel(true, Toolkit.UID(), label));
  }

  addOutPort(label: string): AdvancedPortModel {
    return this.addPort(new AdvancedPortModel(false, Toolkit.UID(), label));
  }

  deSerialize(object: any, engine: DiagramEngine) {
    super.deSerialize(object, engine);
    this.name = object.name;
    this.color = object.color;
  }

  serialize() {
    return _.merge(super.serialize(), {
      name: this.name,
      color: this.color,
    });
  }

  getInPorts(): AdvancedPortModel[] {
    return _.filter(this.ports, portModel => portModel.in);
  }

  getOutPorts(): AdvancedPortModel[] {
    return _.filter(this.ports, portModel => !portModel.in);
  }
}