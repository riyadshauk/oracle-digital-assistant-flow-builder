import { connect } from 'react-redux';
import SystemListNodeWidget from '../../bot-components/systemList/SystemListNodeWidget';
import { addState } from '../actions';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(SystemListNodeWidget);