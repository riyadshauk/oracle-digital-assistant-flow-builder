import { connect } from 'react-redux';
import IntentNodeWidget from '../../bot-components/intent/widget';
import { addState } from '../actions/representation';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(IntentNodeWidget);