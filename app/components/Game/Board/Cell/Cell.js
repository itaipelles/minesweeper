import styles from './Cell.css';

import React from 'react';
import classNames from 'classnames';


const Cell = ({ xRay, flagged, revealed, isMine, adjacentMines, onClick }) => {
    let content = '';

    if(shouldDisplayAdjacentMinesCounter(revealed, xRay, isMine, adjacentMines))
        content = adjacentMines;

    let classes = classNames({
        [styles.root] : true,
        [styles.flag] : flagged,
        [styles.revealed] : revealed,
        [styles.mine] : shouldDisplayMine(isMine, revealed, xRay),
        [styles.xRay] : xRay && !revealed
    });

    const onClickHandler = e => {
        e.preventDefault();
        onClick(e);
    };

    return <td onClick={onClickHandler} className={classes}>{content}</td>;
};

const shouldDisplayAdjacentMinesCounter = (revealed, xRay, isMine, adjacentMines) =>
                                        (revealed || xRay) && !isMine && adjacentMines !== 0;

const shouldDisplayMine = (isMine, revealed, xRay) => isMine && (revealed || xRay);

Cell.propTypes = {
    xRay: React.PropTypes.bool.isRequired,
    flagged: React.PropTypes.bool.isRequired,
    revealed: React.PropTypes.bool.isRequired,
    isMine: React.PropTypes.bool.isRequired,
    adjacentMines: React.PropTypes.number.isRequired,
    onClick: React.PropTypes.func.isRequired
};

export default Cell;