import { connect } from 'react-redux';
import SystemOutputNodeWidget from '../../bot-components/systemOutput/SystemOutputNodeWidget';
import { addState } from '../actions';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(SystemOutputNodeWidget);