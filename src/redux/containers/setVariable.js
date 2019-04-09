import { connect } from 'react-redux';
import SetVariableNodeWidget from '../../bot-components/setVariable/widget';
import { addState } from '../actions';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(SetVariableNodeWidget);