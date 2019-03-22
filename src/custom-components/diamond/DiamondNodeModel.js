// @flow
import { NodeModel } from 'storm-react-diagrams';
import DiamondPortModel from './DiamondPortModel';

export default class DiamondNodeModel extends NodeModel {
  constructor(name: string = 'Untitled', color: string = 'rgb(0,192,255)', type: string = 'diamond') {
    // super(name, color, type);
    super(type);
    this.name = name;
    this.color = color;
    this.addPort(new DiamondPortModel('top'));
    this.addPort(new DiamondPortModel('left'));
    this.addPort(new DiamondPortModel('bottom'));
    this.addPort(new DiamondPortModel('right'));
  }
}
