import { connect } from 'react-redux';
import CopyVariablesNodeWidget from '../../bot-components/copyVariables/widget';
import { addState } from '../actions';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(CopyVariablesNodeWidget);