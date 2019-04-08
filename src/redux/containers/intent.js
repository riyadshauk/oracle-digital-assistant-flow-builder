import { connect } from 'react-redux';
import IntentNodeWidget from '../../bot-components/intent/IntentNodeWidget';
import { addState } from '../actions';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(IntentNodeWidget);