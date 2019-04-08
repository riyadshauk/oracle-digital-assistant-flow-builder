import { connect } from 'react-redux';
import CopyVariablesNodeWidget from '../../bot-components/copyVariables/CopyVariablesNodeWidget';
import { addState } from '../actions';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(CopyVariablesNodeWidget);