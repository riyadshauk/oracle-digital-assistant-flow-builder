// @flow
import * as SRD from 'storm-react-diagrams';
import { AdvancedLinkFactory } from './AdvancedDiagramFactories';
import './sass/main.scss';

/**
 * @author Dylan Vorster
 */
export default class App {
  activeModel: SRD.DiagramModel;

  diagramEngine: SRD.DiagramEngine;

  constructor() {
    this.diagramEngine = new SRD.DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.diagramEngine.registerLinkFactory(new AdvancedLinkFactory());
    this.newModel();
  }

  newModel() {
    this.activeModel = new SRD.DiagramModel();
    this.diagramEngine.setDiagramModel(this.activeModel);
  }

  getActiveDiagram(): SRD.DiagramModel {
    return this.activeModel;
  }

  getDiagramEngine(): SRD.DiagramEngine {
    return this.diagramEngine;
  }
}
