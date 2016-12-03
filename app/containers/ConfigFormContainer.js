import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateGameConfig, newGame } from '../actions';
import ConfigForm from '../components/ConfigForm/ConfigForm';

const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators({updateGameConfig, newGame}, dispatch)
});

export default connect(state => state.gameConfig, mapDispatchToProps)(ConfigForm);