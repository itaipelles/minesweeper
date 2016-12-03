import styles from './Game.css';

import React from 'react';
import Board from './Board/Board';

export default class Game extends React.Component {
    componentDidUpdate(prevProps) {
        this.notifyIfWonOrLost(prevProps);
    }

    notifyIfWonOrLost(prevProps) {
        if(this.wonTheGame(prevProps))
            this.alertThenStartNewGame('You Won!');
        else if (this.lostTheGame(prevProps))
            this.alertThenStartNewGame('You Lost!');
    }

    wonTheGame(prevProps) {
        return this.props.game.won && !prevProps.game.won;
    }

    lostTheGame(prevProps) {
        return this.props.game.lost && !prevProps.game.lost;
    }

    alertThenStartNewGame(message) {
        //when game is won or lost, a mine / flag has to be rendered to the screen.
        //the render function is called before this one, but the browser does not necessarily finish rendering before the alert comes off.
        //window.alert blocks the browser from rendering any new frames, even those sent before the alert.
        //set timeout is used to allow the browser to finish rendering.
        window.setTimeout(() => {
            window.alert(message);
            const { width, height, mines } = this.props.gameConfig;
            this.props.newGame(width, height, mines);
        }, 16);
    }

    render() {
        if(!this.props.game.board.length)
            return null;

        return (
            <div className={styles.container}>
                <div className={styles.marginBottom}>
                    <input checked={this.props.xRay} type="checkbox" onChange={e => this.props.updateXRayVision(e.target.checked)}/>
                    X-Ray Vision
                </div>
                <div className={styles.marginBottom + ' ' + styles.centerSelf}>
                    Flags left: {this.props.game.flagsLeft}
                </div>
                <Board revealCell={this.props.revealCell} toggleCellFlag={this.props.toggleCellFlag} xRay={this.props.xRay}
                       board={this.props.game.board} flagsLeft={this.props.game.flagsLeft}/>
            </div>);
    }
}

Game.propTypes = {
    xRay: React.PropTypes.bool.isRequired,
    game: React.PropTypes.shape({
        won: React.PropTypes.bool.isRequired,
        lost: React.PropTypes.bool.isRequired,
        flagsLeft: React.PropTypes.number.isRequired,
        board: React.PropTypes.arrayOf(
                React.PropTypes.arrayOf(
                    React.PropTypes.shape({
                        flagged: React.PropTypes.bool.isRequired,
                        revealed: React.PropTypes.bool.isRequired,
                        isMine: React.PropTypes.bool.isRequired,
                        adjacentMines: React.PropTypes.number.isRequired
                    })))
    }),
    gameConfig: React.PropTypes.shape({
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        mines: React.PropTypes.number.isRequired
    }),
    revealCell: React.PropTypes.func.isRequired,
    toggleCellFlag: React.PropTypes.func.isRequired,
    newGame: React.PropTypes.func.isRequired,
    updateXRayVision: React.PropTypes.func.isRequired
};