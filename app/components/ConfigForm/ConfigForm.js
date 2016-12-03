import styles from './ConfigForm.css';

import React from 'react';
import { MAX_TABLE_DIMENSION_SIZE, MIN_TABLE_DIMENSION_SIZE, MIN_MINES_NUMBER } from '../../config';

export default class ConfigForm extends React.Component {

    render() {
        return <div>
            <form id={styles.form} onSubmit={e => this.handleSubmit(e)}>
                <div className={styles.inputRow}>
                    <label htmlFor="width-input">Width:</label>
                    <input id="width-input" name="width" type="number" className={styles.input}
                           value={this.props.width} onChange={e => this.handleChange(e)}
                           required min={MIN_TABLE_DIMENSION_SIZE} max={MAX_TABLE_DIMENSION_SIZE} />
                </div>
                <div className={styles.inputRow}>
                    <label htmlFor="height-input">Height:</label>
                    <input id="height-input" name="height" type="number" className={styles.input}
                           value={this.props.height} onChange={e => this.handleChange(e)}
                           required min={MIN_TABLE_DIMENSION_SIZE} max={MAX_TABLE_DIMENSION_SIZE} />
                </div>
                <div className={styles.inputRow}>
                    <label htmlFor="mines-input">Mines:</label>
                    <input id="mines-input" name="mines" type="number" className={styles.input}
                           value={this.props.mines} onChange={e => this.handleChange(e)}
                           required min={MIN_MINES_NUMBER} />
                </div>
                <div>
                    <button id={styles.button} type="submit">New game</button>
                </div>
            </form>
        </div>;
    }

    handleChange(e) {
        this.props.updateGameConfig({
            [e.target.name]: +e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const inputs = e.target.elements;
        const width = +inputs['width'].value,
            height = +inputs['height'].value;
        let mines = +inputs['mines'].value;

        mines = this.adjustMinesIfTooHigh(width, height, mines);
        this.props.newGame(width, height, mines);
    }

    adjustMinesIfTooHigh(width, height, mines) {
        if(mines > width * height - 1) {
            mines = width * height - 1;
            this.props.updateGameConfig({ mines });
            return mines;
        }
        return mines;
    }
}

ConfigForm.propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    mines: React.PropTypes.number,
    updateGameConfig: React.PropTypes.func.isRequired,
    newGame: React.PropTypes.func.isRequired
};