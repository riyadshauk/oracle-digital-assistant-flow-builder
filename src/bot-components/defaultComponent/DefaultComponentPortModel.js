// @flow
import { AdvancedPortModel } from '../../AdvancedDiagramFactories';

export default class DefaultComponentPortModel extends AdvancedPortModel {
  position: string;

  constructor(pos: string) {
    super(pos, 'default-component');
    this.position = pos;
  }
}
