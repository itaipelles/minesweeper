import styles from './App.css';

import React from 'react';
import ConfigForm from '../containers/ConfigFormContainer';
import Game from '../containers/GameContainer';

const App = () => (
  <div id={styles.container}>
    <h1>Mine Sweeper</h1>
    <ConfigForm />
    <Game />
  </div>
);

export default App;