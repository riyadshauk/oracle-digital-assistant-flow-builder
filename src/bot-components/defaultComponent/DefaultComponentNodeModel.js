// @flow
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export default class DefaultComponentNodeModel extends AdvancedNodeModel {
  constructor(name: string = 'Untitled', color: string = 'rgb(0,192,255)', type: string = 'default-component') {
    super(name, color, type);
  }
}
