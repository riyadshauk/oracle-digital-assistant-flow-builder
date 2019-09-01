import { connect } from 'react-redux';
import OutputNodeWidget from '../../bot-components/output/widget';
import { addState } from '../actions/representation';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(OutputNodeWidget);