import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { revealCell, toggleCellFlag, newGame, updateXRayVision } from '../actions';
import Game from '../components/Game/Game';

const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators({revealCell, toggleCellFlag, newGame, updateXRayVision}, dispatch)
});

export default connect(state => state, mapDispatchToProps)(Game);