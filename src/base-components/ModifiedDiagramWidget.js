// @flow
/* eslint-disable react/no-will-update-set-state */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-undef */

/**
 * This file is simply an extension of the React component known as
 * { DiagramWidget } from 'storm-react-diagrams'.
 *
 * The intial purpose of extending DiagramWidget.ts, here, is to dynamically override the delete-key
 * functionality (by allowing the special delete-key functionality only while the shift key is
 * simultaneously pressed)
 *
 * Relevant code revision are annotated with the following comment:
 *  @Riyad-edit: only allow delete functionality while shift key is simultaneously pressed down.
 *
 * DISCLAIMER: I understand that extending React components is heavily discouraged in the
 * React/Facebook community; however, the storm-react-diagrams library was built in a way that
 * highly encourages extending React components. To avoid massive code duplication, I've decided
 * to follow along with this (anti?)-pattern here.
 *
 * I may want to fix this issue in the future (maybe creating a PR to storm-react-diagrams?)
 * @see https://reactjs.org/docs/composition-vs-inheritance.html
 */
import * as React from 'react';
import * as _ from 'lodash';
import {
  DiagramEngine,
  BaseAction,
  MoveItemsAction,
  PointModel,
  PortModel,
  LinkModel,
  BaseWidgetProps,
  DiagramWidget,
  BaseModel,
  Toolkit,
  LinkLayerWidget,
  NodeLayerWidget,
  SelectingAction,
  MoveCanvasAction,
} from 'storm-react-diagrams';
import store from '../redux/store';
import { removeState, removeTransition } from '../redux/actions/representation';
import { AdvancedNodeModel } from '../AdvancedDiagramFactories';

export interface DiagramProps extends BaseWidgetProps {
  diagramEngine: DiagramEngine;

  allowLooseLinks?: boolean;
  allowCanvasTranslation?: boolean;
  allowCanvasZoom?: boolean;
  inverseZoom?: boolean;
  maxNumberPointsPerLink?: number;
  smartRouting?: boolean;

  actionStartedFiring?: (action: BaseAction) => boolean;
  actionStillFiring?: (action: BaseAction) => void;
  actionStoppedFiring?: (action: BaseAction) => void;

  deleteKeys?: number[];
}

export interface DiagramState {
  action: BaseAction | null;
  wasMoved: boolean;
  renderedNodes: boolean;
  windowListener: any;
  diagramEngineListener: any;
  document: any;
  // @Riyad-edit: only allow delete functionality while shift key is simultaneously pressed down.
  shiftKeyDown: boolean;
}

export const defaultProps: DiagramProps = {
  diagramEngine: null,
  allowLooseLinks: true,
  allowCanvasTranslation: true,
  allowCanvasZoom: true,
  inverseZoom: false,
  maxNumberPointsPerLink: Infinity, // backwards compatible default
  smartRouting: false,
  /**
   * @todo store this in Redux state so can over-write deleteKeys to be []
   * when typing (ie in DefaultComponentNodeWidget)
   */
  deleteKeys: [
    46,
    8,
  ],
};

/**
 * @author Dylan Vorster
 * @author Riyad Shauk
 */
export default class ModifiedDiagramWidget extends DiagramWidget<DiagramProps, DiagramState> {
  /**
   * @note NOTE: Please note that the following commented-out method signatures are derived
   * from the base class, DiagramWidget. If you override any of these methods, you must first
   * copy-paste down the corresponding logic from DiagramWidget, in order to preserve the
   * existing functionality.
   */

  // componentWillReceiveProps(nextProps: DiagramProps)

  // componentWillUpdate(nextProps: DiagramProps)

  // componentDidUpdate()

  /**
   * Gets a model and element under the mouse cursor
   */
  // getMouseElement(event: Event): { model: BaseModel<BaseEntity,
  //   BaseModelListener>; element, };

  // fireAction()

  // stopFiringAction(shouldSkipEvent?: boolean)

  // startFiringAction(action: BaseAction)

  // onMouseMove = (event: Event) => {

  // drawSelectionBox()

  onKeyUpPointer: (thisVar: EventTarget, ev: KeyboardEvent) => void;

  // @Riyad-edit: only allow delete functionality while shift key is simultaneously pressed down.
  onKeyDownPointer: (thisVar: EventTarget, ev: KeyboardEvent) => void;

  constructor(props: DiagramProps) {
    super('srd-diagram', props);
    this.state = {
      action: null,
      wasMoved: false,
      renderedNodes: false,
      windowListener: null,
      diagramEngineListener: null,
      document: null,
      // eslint-disable-next-line max-len
      // @Riyad-edit: only allow delete functionality while shift key is simultaneously pressed down.
      shiftKeyDown: false,
    };
  }

  componentWillUnmount() {
    this.props.diagramEngine.removeListener(this.state.diagramEngineListener);
    this.props.diagramEngine.setCanvas(null);
    // eslint-disable-next-line no-undef
    window.removeEventListener('keyup', this.onKeyUpPointer);
    // @Riyad-edit: only allow delete functionality while shift key is simultaneously pressed down.
    // eslint-disable-next-line no-undef
    window.removeEventListener('keydown', this.onKeyDownPointer);
    // eslint-disable-next-line no-undef
    window.removeEventListener('mouseUp', this.onMouseUp);
    // eslint-disable-next-line no-undef
    window.removeEventListener('mouseMove', this.onMouseMove);
  }

  componentDidMount() {
    this.onKeyUpPointer = this.onKeyUp.bind(this);

    // @Riyad-edit: only allow delete functionality while shift key is simultaneously pressed down.
    this.onKeyDownPointer = this.onKeyDown.bind(this);

    // add a keyboard listener
    this.setState({
      // eslint-disable-next-line no-undef
      document,
      renderedNodes: true,
      diagramEngineListener: this.props.diagramEngine.addListener({
        repaintCanvas: () => {
          this.forceUpdate();
        },
      }),
    });

    // eslint-disable-next-line no-undef
    window.addEventListener('keyup', this.onKeyUpPointer, false);

    // eslint-disable-next-line no-undef
    window.addEventListener('keydown', this.onKeyDownPointer, false); // @Riyad-edit: only allow delete functionality while shift key is simultaneously pressed down.

    // dont focus the window when in test mode - jsdom fails
    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-undef
      window.focus();
    }
  }

  onKeyUp(event: Event) {
    // delete all selected
    // @Riyad-edit: only allow delete functionality while shift key is simultaneously pressed down.
    if (!this.state.shiftKeyDown) {
      return;
    }
    // $FlowFixMe
    if (this.props.deleteKeys.indexOf(event.keyCode) !== -1) {
      _.forEach(this.props.diagramEngine.getDiagramModel().getSelectedItems(), (element) => {
        // only delete items which are not locked
        if (!this.props.diagramEngine.isModelLocked(element)) {
          // dispatch any removal actions here (ie: removeState, removeAction, etc)
          if (element instanceof AdvancedNodeModel) {
            store.dispatch(removeState(element.id));
          } else if (element
            && element.sourcePort && element.targetPort
            && element.targetPort.parent
            && element.targetPort.parent.id
          ) {
            store.dispatch(
              removeTransition({
                sourcePortParentID: element.sourcePort.parent.id,
                sourcePortLabel: element.sourcePort.label,
                targetPortParentID: element.targetPort.parent.id,
                targetPortLabel: element.targetPort.label,
              }),
            );
            element.remove();
          } else if (element.type !== 'context') {
            element.remove();
          }
        }
      });
      this.forceUpdate();
    }
    // @Riyad-edit: only allow delete functionality while shift key is simultaneously pressed down.
    this.setState({ shiftKeyDown: false });
  }

  // @Riyad-edit: only allow delete functionality while shift key is simultaneously pressed down.
  onKeyDown(event: Event) {
    // register shift key
    // $FlowFixMe
    if (event.shiftKey) {
      this.setState({ shiftKeyDown: true });
    }
  }

  onMouseUp = (event: Event) => {
    const { diagramEngine } = this.props;
    // are we going to connect a link to something?
    if (this.state.action instanceof MoveItemsAction) {
      const element = this.getMouseElement(event);
      _.forEach(this.state.action.selectionModels, (model) => {
        // only care about points connecting to things
        if (!(model.model instanceof PointModel)) {
          return;
        }
        if (element && element.model instanceof PortModel
          && !diagramEngine.isModelLocked(element.model)) {
          const link = model.model.getLink();
          if (link.getTargetPort() !== null) {
            // eslint-disable-next-line max-len
            // if this was a valid link already and we are adding a node in the middle, create 2 links from the original
            if (link.getTargetPort() !== element.model && link.getSourcePort() !== element.model) {
              const targetPort = link.getTargetPort();
              const newLink = link.clone({});
              newLink.setSourcePort(element.model);
              newLink.setTargetPort(targetPort);
              link.setTargetPort(element.model);
              targetPort.removeLink(link);
              newLink.removePointsBefore(newLink.getPoints()[link.getPointIndex(model.model)]);
              link.removePointsAfter(model.model);
              diagramEngine.getDiagramModel().addLink(newLink);
              // if we are connecting to the same target or source, remove tweener points
            } else if (link.getTargetPort() === element.model) {
              link.removePointsAfter(model.model);
            } else if (link.getSourcePort() === element.model) {
              link.removePointsBefore(model.model);
            }
          } else {
            link.setTargetPort(element.model);
          }
          delete this.props.diagramEngine.linksThatHaveInitiallyRendered[link.getID()];
        }
      });

      // check for / remove any loose links in any models which have been moved
      if (!this.props.allowLooseLinks && this.state.wasMoved) {
        _.forEach(this.state.action.selectionModels, (model) => {
          // only care about points connecting to things
          if (!(model.model instanceof PointModel)) {
            return;
          }

          const selectedPoint: PointModel = model.model;
          const link: LinkModel = selectedPoint.getLink();
          if (link.getSourcePort() === null || link.getTargetPort() === null) {
            link.remove();
          }
        });
      }

      // remove any invalid links
      _.forEach(this.state.action.selectionModels, (model) => {
        // only care about points connecting to things
        if (!(model.model instanceof PointModel)) {
          return;
        }

        const link: LinkModel = model.model.getLink();
        const sourcePort: PortModel = link.getSourcePort();
        const targetPort: PortModel = link.getTargetPort();
        if (sourcePort !== null && targetPort !== null) {
          if (!sourcePort.canLinkToPort(targetPort)) {
            // link not allowed
            link.remove();
          } else if (
            _.some(
              _.values(targetPort.getLinks()),
              (l: LinkModel) => l !== link && (l.getSourcePort() === sourcePort
                || l.getTargetPort() === sourcePort),
            )
          ) {
            // link is a duplicate
            link.remove();
          }
        }
      });

      diagramEngine.clearRepaintEntities();
      this.stopFiringAction(!this.state.wasMoved);
    } else {
      diagramEngine.clearRepaintEntities();
      this.stopFiringAction();
    }
    this.state.document.removeEventListener('mousemove', this.onMouseMove);
    this.state.document.removeEventListener('mouseup', this.onMouseUp);
  };

  /**
   * Gets a model and element under the mouse cursor
   */
  getMouseElement(event: any): { model: BaseModel; element: Element } {
    const { target } = event;
    const diagramModel = this.props.diagramEngine.diagramModel;

    // is it a port
    const element = Toolkit.closest(target, '.port[data-name]');
    if (element) {
      const nodeElement = Toolkit.closest(target, '.node[data-nodeid]');
      return {
        model: diagramModel
          .getNode(nodeElement.getAttribute('data-nodeid'))
          .getPort(element.getAttribute('data-name')),
        element,
      };
    }

    // look for a point
    element = Toolkit.closest(target, '.point[data-id]');
    if (element) {
      return {
        model: diagramModel
          .getLink(element.getAttribute('data-linkid'))
          .getPointModel(element.getAttribute('data-id')),
        element,
      };
    }

    // look for a link
    element = Toolkit.closest(target, '[data-linkid]');
    if (element) {
      return {
        model: diagramModel.getLink(element.getAttribute('data-linkid')),
        element,
      };
    }

    // look for a node
    element = Toolkit.closest(target, '.node[data-nodeid]');
    if (element) {
      return {
        model: diagramModel.getNode(element.getAttribute('data-nodeid')),
        element,
      };
    }

    return null;
  }

  // @Riyad-edit: zooming onWheel issue in Chrome 73+
  // @see: https://github.com/projectstorm/react-diagrams/issues/333 , https://github.com/facebook/react/issues/6436#issuecomment-479454289
  BlockPageScroll = ({ children }) => {
    const { useEffect, useRef } = React;
    const scrollRef = useRef(null);
    useEffect(() => {
      const scrollEl = scrollRef.current;
      const stopScroll = e => e.preventDefault();
      scrollEl.addEventListener('wheel', stopScroll);
      return () => scrollEl.removeEventListener('wheel', stopScroll);
    }, []);
    return (
      <div ref={ scrollRef }>
        {children}
      </div>
    );
  }

  render() {
    const { diagramEngine } = this.props;
    diagramEngine.setMaxNumberPointsPerLink(this.props.maxNumberPointsPerLink);
    diagramEngine.setSmartRoutingStatus(this.props.smartRouting);
    const diagramModel = diagramEngine.getDiagramModel();

    return (
      <this.BlockPageScroll>
        <div
          {...this.getProps()}
          ref={ref => {
            if (ref) {
              this.props.diagramEngine.setCanvas(ref);
            }
          }}
          onWheel={event => {
            if (this.props.allowCanvasZoom) {
              event.preventDefault();
              event.stopPropagation();
              const oldZoomFactor = diagramModel.getZoomLevel() / 100;
              let scrollDelta = this.props.inverseZoom ? -event.deltaY : event.deltaY;
              // check if it is pinch gesture
              if (event.ctrlKey && scrollDelta % 1 !== 0) {
                /*Chrome and Firefox sends wheel event with deltaY that
                  have fractional part, also `ctrlKey` prop of the event is true
                  though ctrl isn't pressed
                */
                scrollDelta /= 3;
              } else {
                scrollDelta /= 60;
              }
              if (diagramModel.getZoomLevel() + scrollDelta > 10) {
                diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta);
              }

              const zoomFactor = diagramModel.getZoomLevel() / 100;

              const boundingRect = event.currentTarget.getBoundingClientRect();
              const clientWidth = boundingRect.width;
              const clientHeight = boundingRect.height;
              // compute difference between rect before and after scroll
              const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
              const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
              // compute mouse coords relative to canvas
              const clientX = event.clientX - boundingRect.left;
              const clientY = event.clientY - boundingRect.top;

              // compute width and height increment factor
              const xFactor = (clientX - diagramModel.getOffsetX()) / oldZoomFactor / clientWidth;
              const yFactor = (clientY - diagramModel.getOffsetY()) / oldZoomFactor / clientHeight;

              diagramModel.setOffset(
                diagramModel.getOffsetX() - widthDiff * xFactor,
                diagramModel.getOffsetY() - heightDiff * yFactor
              );

              diagramEngine.enableRepaintEntities([]);
              this.forceUpdate();
            }
          }}
          onMouseDown={event => {
            this.setState({ ...this.state, wasMoved: false });

            diagramEngine.clearRepaintEntities();
            const model = this.getMouseElement(event);
            // the canvas was selected
            if (model === null) {
              // is it a multiple selection
              if (event.shiftKey) {
                const relative = diagramEngine.getRelativePoint(event.clientX, event.clientY);
                this.startFiringAction(new SelectingAction(relative.x, relative.y));
              } else {
                // its a drag the canvas event
                diagramModel.clearSelection();
                this.startFiringAction(new MoveCanvasAction(event.clientX, event.clientY, diagramModel));
              }
            } else if (model.model instanceof PortModel) {
              //i ts a port element, we want to drag a link
              if (!this.props.diagramEngine.isModelLocked(model.model)) {
                const relative = diagramEngine.getRelativeMousePoint(event);
                const sourcePort = model.model;
                const link = sourcePort.createLinkModel();
                link.setSourcePort(sourcePort);

                if (link) {
                  link.removeMiddlePoints();
                  if (link.getSourcePort() !== sourcePort) {
                    link.setSourcePort(sourcePort);
                  }
                  link.setTargetPort(null);

                  link.getFirstPoint().updateLocation(relative);
                  link.getLastPoint().updateLocation(relative);

                  diagramModel.clearSelection();
                  link.getLastPoint().setSelected(true);
                  diagramModel.addLink(link);

                  this.startFiringAction(
                    new MoveItemsAction(event.clientX, event.clientY, diagramEngine)
                  );
                }
              } else {
                diagramModel.clearSelection();
              }
            } else {
              // its some or other element, probably want to move it
              if (!event.shiftKey && !model.model.isSelected()) {
                diagramModel.clearSelection();
              }
              model.model.setSelected(true);

              this.startFiringAction(new MoveItemsAction(event.clientX, event.clientY, diagramEngine));
            }
            this.state.document.addEventListener('mousemove', this.onMouseMove);
            this.state.document.addEventListener('mouseup', this.onMouseUp);
          }}
        >
          {this.state.renderedNodes && (
            <LinkLayerWidget
              diagramEngine={diagramEngine}
              pointAdded={(point: PointModel, event) => {
                this.state.document.addEventListener('mousemove', this.onMouseMove);
                this.state.document.addEventListener('mouseup', this.onMouseUp);
                event.stopPropagation();
                diagramModel.clearSelection(point);
                this.setState({
                  action: new MoveItemsAction(event.clientX, event.clientY, diagramEngine)
                });
              }}
            />
          )}
          <NodeLayerWidget diagramEngine={diagramEngine} />
          {this.state.action instanceof SelectingAction && this.drawSelectionBox()}
        </div>
      </this.BlockPageScroll>
    );
  }


}
ModifiedDiagramWidget.defaultProps = defaultProps;