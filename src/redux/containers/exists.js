import { connect } from 'react-redux';
import ConditionExistsNodeWidget from '../../bot-components/conditionExists/ConditionExistsNodeWidget';
import { addState } from '../actions';

const actionCreators = {
  addState,
};

export default connect(null, actionCreators)(ConditionExistsNodeWidget);