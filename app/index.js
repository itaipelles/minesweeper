import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import minesweeperApp from './reducers';
import App from './components/App';

const store = createStore(minesweeperApp, undefined, autoRehydrate());
persistStore(store);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);