// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import * as _ from 'lodash';
import {
  DefaultPortModel, DefaultLinkWidget,
  DiagramEngine, Toolkit, NodeModel, NodeModelListener,
  BaseEvent,
  DefaultLinkModel,
  DefaultLinkFactory,
  // LinkModel,
  // PortModel,
} from 'storm-react-diagrams';
import ModifiedDefaultLinkModel from './base-components/ModifiedDefaultLinkModel';
// import ModifiedLinkModel from '../playground/ModifiedLinkModel';
// import ModifiedDefaultLinkModel from './base-components/ModifiedDefaultLinkModel';

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

    // console.log('AdvancedLinkModel this:', this);
    // this.addLabel(`${this.sourcePort.label} ->`);
  }

  // remove() {
  //   this.iterateListeners((listener, event) => {
  //     if (listener.entityRemoved) {
  //       listener.entityRemoved(event);
  //     }
  //   });
  // }

  // iterateListeners(cb: (t: any, event: BaseEvent) => any) {
  //   const event: BaseEvent = {
  //     id: Toolkit.UID(),
  //     firing: true,
  //     entity: this,
  //     stopPropagation: () => {
  //       event.firing = false;
  //     },
  //   };

  //   for (let i = 0; i < this.listeners.length; i += 1) {
  //     if (this.listeners.hasOwnProperty(i)) {
  //       // propagation stopped
  //       if (!event.firing) {
  //         return;
  //       }
  //       cb(this.listeners[i], event);
  //     }
  //   }
  // }
}

export class AdvancedPortModel extends DefaultPortModel {
  createLinkModel(): AdvancedLinkModel {
    return new AdvancedLinkModel();
  }

  // link(port: PortModel): LinkModel {
  //   const link = this.createLinkModel();
  //   link.setSourcePort(this);
  //   link.setTargetPort(port);
  //   link.addLabel(`${this.sourcePort.label} -> ${link.targetPort.label}`);
  //   console.log('AdvancedPortModel link:', link);
  //   return link;
  // }

  canLinkToPort = () => true;
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
    // console.log('AdvancedLinkModel model:', model);
    // model.addLabel(`${model.sourcePort.label} ->`);
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

  constructor(name: string = 'Untitled', color: string = 'lightblue', type: string = 'default') {
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