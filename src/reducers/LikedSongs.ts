import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { LikedSongsItem } from "../components/playlists/Types";

interface LikedSongsInt {
    items: LikedSongsItem[]
    uris: string[]
    offset_uri: string
    pageCounter: number,
    previousSong: string,
    currentSong: string,
    nextSong: string
}

const initialState = {
    items: [],
    uris: [],
    offset_uri: "",
    pageCounter: 0,
    previousSong: "",
    currentSong: "",
    nextSong: "",
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
        setCurrentSong(state, action: PayloadAction<string>) {
            const uris = current(state.uris)
            const currentIndex = uris.indexOf(action.payload);
            state.currentSong = action.payload
            state.previousSong = uris[currentIndex - 1] ?? "";
            state.nextSong = uris[currentIndex + 1] ?? "";
        },
        setPreviousSong(state){
            const uris = current(state.uris)
            const currentIndex = uris.indexOf(state.currentSong);
            state.previousSong = uris[currentIndex -2] ?? ""
            state.currentSong = uris[currentIndex -1] ?? ""
            state.nextSong = uris[currentIndex] ?? ""
        },
        setNextSong(state){
            const uris = current(state.uris)
            const currentIndex = uris.indexOf(state.currentSong);
            state.previousSong = uris[currentIndex] ?? "";
            state.currentSong = uris[currentIndex + 1 ] ?? "";
            state.nextSong = uris[currentIndex + 2 ] ?? "";
        }
    }
})

export const { 
    updateItems, 
    incrementPageCounter, 
    setCurrentSong, 
    setPreviousSong, 
    setNextSong } = LikedSongsSlice.actions;

export default LikedSongsSlice;