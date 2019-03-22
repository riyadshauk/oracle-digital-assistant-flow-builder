// @flow
import * as _ from 'lodash';
import {
  LinkModel, DiagramEngine, PortModel,
} from 'storm-react-diagrams';
import { AdvancedLinkModel } from '../../AdvancedDiagramFactories';

export default class DiamondPortModel extends PortModel {
  position: string | 'top' | 'bottom' | 'left' | 'right';

  constructor(pos: string = 'top') {
    super(pos, 'diamond');
    this.position = pos;
  }

  serialize() {
    return _.merge(super.serialize(), {
      position: this.position,
    });
  }

  deSerialize(data: any, engine: DiagramEngine) {
    super.deSerialize(data, engine);
    this.position = data.position;
  }

  // eslint-disable-next-line class-methods-use-this
  createLinkModel(): LinkModel {
    return new AdvancedLinkModel();
  }
}
