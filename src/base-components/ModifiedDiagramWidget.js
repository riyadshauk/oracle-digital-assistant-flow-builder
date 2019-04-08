// @flow
/* eslint-disable react/no-will-update-set-state */
/* eslint-disable react/no-did-update-set-state */

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
} from 'storm-react-diagrams';
import store from '../redux/store';
import { removeState, removeAction } from '../redux/actions';

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
  //   BaseModelListener>; element: Element };

  // fireAction()

  // stopFiringAction(shouldSkipEvent?: boolean)

  // startFiringAction(action: BaseAction)

  // onMouseMove = (event: Event) => {

  // drawSelectionBox()

  // render()

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
          console.log('element:', element);
          store.dispatch(removeState(element.id));
          if (Object.prototype.hasOwnProperty.call(element, 'sourcePort')
            && Object.prototype.hasOwnProperty.call(element, 'targetPort')
          ) {
            store.dispatch(
              removeAction(element.sourcePort.parent.id, element.targetPort.parent.id),
            );
          }
          element.remove();
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
            console.log('link:', link);
            // link.remove();
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
}
ModifiedDiagramWidget.defaultProps = defaultProps;