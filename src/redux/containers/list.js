import { connect } from 'react-redux';
import ListNodeWidget from '../../bot-components/list/widget';
import { addState } from '../actions';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(ListNodeWidget);