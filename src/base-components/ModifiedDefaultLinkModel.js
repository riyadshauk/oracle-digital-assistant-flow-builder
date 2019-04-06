// @flow
/**
 * @author Dylan Vorster
 * @author Riyad Shauk
 */
import * as _ from 'lodash';
import {
  LinkModelListener,
  BaseEvent,
  DiagramEngine,
  DefaultLabelModel,
  LabelModel,
  DefaultLinkModel,
  LinkModel,
  PortModel,
} from 'storm-react-diagrams';
// import ModifiedLinkModel from '../../playground/ModifiedLinkModel';

export interface DefaultLinkModelListener extends LinkModelListener {
  colorChanged?: (event: BaseEvent<DefaultLinkModel> & { color: null | string }) => void;

  widthChanged?: (event: BaseEvent<DefaultLinkModel> & { width: 0 | number }) => void;
}

export default class ModifiedDefaultLinkModel extends LinkModel<DefaultLinkModelListener> {
  width: number;

  color: string;

  curvyness: number;

  constructor(type: string = 'default') {
    super(type);
    this.color = 'rgba(255,255,255,0.5)';
    this.width = 3;
    this.curvyness = 50;
  }

  serialize() {
    return _.merge(super.serialize(), {
      width: this.width,
      color: this.color,
      curvyness: this.curvyness,
    });
  }

  deSerialize(ob: any, engine: DiagramEngine) {
    super.deSerialize(ob, engine);
    this.color = ob.color;
    this.width = ob.width;
    this.curvyness = ob.curvyness;
  }

  addLabel(label: LabelModel | string) {
    if (label instanceof LabelModel) {
      return super.addLabel(label);
    }
    const labelOb = new DefaultLabelModel();
    labelOb.setLabel(label);
    return super.addLabel(labelOb);
  }

  setWidth(width: number) {
    this.width = width;
    this.iterateListeners((listener: DefaultLinkModelListener, event: BaseEvent) => {
      if (listener.widthChanged) {
        listener.widthChanged({ ...event, width });
      }
    });
  }

  setColor(color: string) {
    this.color = color;
    this.iterateListeners((listener: DefaultLinkModelListener, event: BaseEvent) => {
      if (listener.colorChanged) {
        listener.colorChanged({ ...event, color });
      }
    });
  }

  // decorate and modify some methods from LinkModel:

  // @Riyad-edit: add meaningful label to link
  generateLabelIfPossible() {
    if (this.targetPort === null || this.sourcePort === null) {
      return;
    }

    console.log('this.sourcePort:', this.sourcePort);
    console.log('this.targetPort:', this.targetPort);

    // eslint-disable-next-line max-len
    // this.addLabel(`${this.sourcePort.parent.name}.${this.sourcePort.label} -–> ${this.targetPort.parent.name}.${this.targetPort.label}`);
    // $FlowFixMe
    this.addLabel(`${this.sourcePort.label} ––> ${this.targetPort.label}`);
  }

  setSourcePort(port: PortModel) {
    if (port !== null) {
      port.addLink(this);
    }
    if (this.sourcePort !== null) {
      this.sourcePort.removeLink(this);
    }
    this.sourcePort = port;
    this.iterateListeners((listener: LinkModelListener, event) => {
      if (listener.sourcePortChanged) {
        listener.sourcePortChanged({ ...event, port });
      }
    });
    // @Riyad-edit: add meaningful label to link
    this.generateLabelIfPossible();
  }

  setTargetPort(port: PortModel) {
    if (port !== null) {
      port.addLink(this);
    }
    if (this.targetPort !== null) {
      this.targetPort.removeLink(this);
    }
    this.targetPort = port;
    this.iterateListeners((listener: LinkModelListener, event) => {
      if (listener.targetPortChanged) {
        listener.targetPortChanged({ ...event, port });
      }
    });
    // @Riyad-edit: add meaningful label to link
    this.generateLabelIfPossible();
  }
}
