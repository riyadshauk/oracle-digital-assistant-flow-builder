import { connect } from 'react-redux';
import ParametersNodeWidget from '../../bot-components/parameters/widget';
import {
  addParameter,
  renameParameter,
  removeParameter,
} from '../actions/representation';

const actionCreators = {
  addParameter,
  renameParameter,
  removeParameter,
};

export default connect(null, actionCreators)(ParametersNodeWidget);