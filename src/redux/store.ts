import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { usuariosApi } from "../services/UsersAndSongs";
import  DeviceInfoSlice  from '../reducers/DeviceInfo'
import LikedSongsSlice from "../reducers/LikedSongs";

const reducer = combineReducers({
    [usuariosApi.reducerPath]: usuariosApi.reducer,
    DeviceInfo : DeviceInfoSlice.reducer,
    LikedSongs : LikedSongsSlice.reducer
})

export const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(usuariosApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export { }