export { };

declare global {
    interface Window {
        Spotify: any
        onSpotifyWebPlaybackSDKReady:any
    }
}