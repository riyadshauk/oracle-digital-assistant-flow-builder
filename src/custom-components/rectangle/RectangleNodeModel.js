// @flow
import { NodeModel } from 'storm-react-diagrams';
import RectanglePortModel from './RectanglePortModel';

export default class RectangleNodeModel extends NodeModel {
  constructor(name: string = 'Untitled', color: string = 'rgb(0,192,255)', type: string = 'rectangle') {
    super(type);
    this.name = name;
    this.color = color;
    this.addPort(new RectanglePortModel('top'));
    this.addPort(new RectanglePortModel('left'));
    this.addPort(new RectanglePortModel('bottom'));
    this.addPort(new RectanglePortModel('right'));
  }
}
