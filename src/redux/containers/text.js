import { connect } from 'react-redux';
import TextNodeWidget from '../../bot-components/text/widget';
import { addState } from '../actions/representation';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(TextNodeWidget);