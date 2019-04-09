import { connect } from 'react-redux';
import ExistsNodeWidget from '../../bot-components/exists/widget';
import { addState } from '../actions';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(ExistsNodeWidget);