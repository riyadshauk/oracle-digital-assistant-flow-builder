import { connect } from 'react-redux';
import GeneralNodeWidget from '../../bot-components/general/widget';
import { addState } from '../actions/representation';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(GeneralNodeWidget);