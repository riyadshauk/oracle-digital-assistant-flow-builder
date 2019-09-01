import { connect } from 'react-redux';
import SetVariableNodeWidget from '../../bot-components/setVariable/widget';
import { addState } from '../actions/representation';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(SetVariableNodeWidget);