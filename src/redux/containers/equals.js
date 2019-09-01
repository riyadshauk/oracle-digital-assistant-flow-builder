import { connect } from 'react-redux';
import EqualsNodeWidget from '../../bot-components/equals/widget';
import { addState } from '../actions/representation';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(EqualsNodeWidget);