import styles from './Board.css';

import React from 'react';
import Cell from './Cell/Cell';

export default class Board extends React.Component {
    render() {
        if(!this.props.board.length)
            return null;

        return <table className={styles.table}>
                    <tbody>
                    {this.props.board.map((row, x) => (
                        <tr key={x}>{row.map((cell, y) => (
                            <Cell key={x + ',' + y} xRay={this.props.xRay} {...cell} onClick={e => this.onCellClick(e, x, y)}/>
                        ))}</tr>
                    ))}
                    </tbody>
                </table>;
    }

    onCellClick(e, x, y) {
        if(e.shiftKey) {
            if(this.isFlaggingButHasNoFlagsLeft(x, y)) {
                window.alert('No flags left!');
                return;
            }

            this.props.toggleCellFlag(x, y);
        }
        else
            this.props.revealCell(x, y);
    }

    isFlaggingButHasNoFlagsLeft(x, y) {
        return this.props.flagsLeft === 0 && !this.props.board[x][y].flagged;
    }

}

Board.propTypes = {
    xRay: React.PropTypes.bool.isRequired,
    flagsLeft: React.PropTypes.number.isRequired,
    board: React.PropTypes.arrayOf(
            React.PropTypes.arrayOf(
                React.PropTypes.shape({
                    flagged: React.PropTypes.bool,
                    revealed: React.PropTypes.bool,
                    isMine: React.PropTypes.func.bool,
                    adjacentMines: React.PropTypes.func.number
                }))).isRequired,
    revealCell: React.PropTypes.func.isRequired,
    toggleCellFlag: React.PropTypes.func.isRequired,
};