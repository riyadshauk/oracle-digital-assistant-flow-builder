import { connect } from 'react-redux';
import ConditionEqualsNodeWidget from '../../bot-components/conditionEquals/ConditionEqualsNodeWidget';
import { addState } from '../actions';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(ConditionEqualsNodeWidget);