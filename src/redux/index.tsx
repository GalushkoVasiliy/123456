// import {createStore, applyMiddleware} from 'redux';
// import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import thunk from 'redux-thunk';
// import rootReducer from './reducers/reducers.js';

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['yourReducerKey'],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = createStore(persistedReducer, applyMiddleware(thunk));
// const persistor = persistStore(store);

// export {store, persistor};

// store.js
import {createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import rootReducer from './reducers/reducers'; // Replace with your root reducer
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root', // the key to use for storing the data in storage
  storage: AsyncStorage,
  // Optionally, you can whitelist or blacklist specific reducers
  // whitelist: ['reducerName'],
  // blacklist: ['reducerName'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));

const persistor = persistStore(store);

export {store, persistor};
