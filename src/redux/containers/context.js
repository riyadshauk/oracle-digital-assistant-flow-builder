import { connect } from 'react-redux';
import ContextNodeWidget from '../../bot-components/context/widget';
import {
  addContextVariable,
  renameContextVariable,
  removeContextVariable,
} from '../actions/representation';

const actionCreators = {
  addContextVariable,
  renameContextVariable,
  removeContextVariable,
};

export default connect(null, actionCreators)(ContextNodeWidget);