import { connect } from 'react-redux';
import SystemVariablesNodeWidget from '../../bot-components/systemVariables/widget';
import {
  addSystemVariable,
  renameSystemVariable,
  removeSystemVariable,
} from '../actions/representation';

const actionCreators = {
  addSystemVariable,
  renameSystemVariable,
  removeSystemVariable,
};

export default connect(null, actionCreators)(SystemVariablesNodeWidget);