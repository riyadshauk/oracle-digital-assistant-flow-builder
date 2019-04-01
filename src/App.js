// @flow
import * as SRD from 'storm-react-diagrams';
import { AdvancedLinkFactory } from './AdvancedDiagramFactories';
// $FlowFixMe
import './sass/main.scss';
import DiamondNodeFactory from './custom-components/diamond/DiamondNodeFactory';
import SimplePortFactory from './custom-components/SimplePortFactory';
import DiamondPortModel from './custom-components/diamond/DiamondPortModel';
import RectangleNodeFactory from './custom-components/rectangle/RectangleNodeFactory';
import ContextNodeFactory from './bot-components/context/ContextNodeFactory';
import DefaultComponentNodeFactory from './bot-components/defaultComponent/DefaultComponentNodeFactory';
import ConditionExistsNodeFactory from './bot-components/conditionExists/ConditionExistsNodeFactory';
import SystemListNodeFactory from './bot-components/systemList/SystemListNodeFactory';

/**
 * @author Dylan Vorster
 */
export default class App {
  activeModel: SRD.DiagramModel;

  diagramEngine: SRD.DiagramEngine;

  constructor() {
    this.diagramEngine = new SRD.DiagramEngine();
    /**
     * Add a decorator over diagramEngine?
     * -> Curry certain functions (adding links, etc) to wrap extra functionality?
     */
    this.diagramEngine.installDefaultFactories();
    this.diagramEngine.registerLinkFactory(new AdvancedLinkFactory());
    this.diagramEngine.registerPortFactory(new SimplePortFactory('diamond', () => new DiamondPortModel()));
    this.diagramEngine.registerNodeFactory(new DiamondNodeFactory());
    this.diagramEngine.registerNodeFactory(new RectangleNodeFactory());
    this.diagramEngine.registerNodeFactory(new ContextNodeFactory());
    this.diagramEngine.registerNodeFactory(new DefaultComponentNodeFactory());
    this.diagramEngine.registerNodeFactory(new ConditionExistsNodeFactory());
    this.diagramEngine.registerNodeFactory(new SystemListNodeFactory());
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
