import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LikedSongsItem } from "../components/playlists/Types";

interface currentSongInt {
    uri: string
    name: string
}

interface LikedSongsInt {
    items: LikedSongsItem[]
    uris: string[]
    offset_uri: string
    pageCounter: number,
    previousSong: string,
    currentSong: currentSongInt,
    nextSong: string,
    paused: boolean
}

const initialState = {
    items: [],
    uris: [],
    offset_uri: "",
    pageCounter: 0,
    previousSong: "",
    currentSong: {name: "", uri:""},
    nextSong: "",
    paused: true,
} as LikedSongsInt

const LikedSongsSlice = createSlice({
    name: "LikedSongsSlice",
    initialState: initialState,
    reducers: {
        updateItems(state, action: PayloadAction<LikedSongsItem[]>) {
            const uris = state.items.map(e => e.track.uri)
            if (!uris.includes(action.payload[0].track.uri)) {
                state.uris = state.uris.concat(action.payload.map(e => e.track.uri));
                state.items = state.items.concat(action.payload);
            }
        },
        incrementPageCounter(state) {
            state.pageCounter++
        },
        setCurrentSong(state, action:PayloadAction<currentSongInt>) {
            state.currentSong = action.payload;
        },
        setIsPaused(state, action:PayloadAction<boolean>){
            state.paused = action.payload;
        },        
    }
})

export const { 
    updateItems, 
    incrementPageCounter,
    setCurrentSong,
    setIsPaused
} = LikedSongsSlice.actions;

export default LikedSongsSlice;