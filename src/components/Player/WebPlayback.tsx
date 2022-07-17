import { useEffect, useState } from "react";
import { store } from "../../redux/store";
import DeviceInfo from "../../reducers/DeviceInfo";
import { FaPlay, FaPause } from "react-icons/fa";
import { GiPreviousButton, GiNextButton } from "react-icons/gi";
import './WebPlayback.css'
import { usePlayResumeMutation } from "../../services/UsersAndSongs";
import { useSelector } from "react-redux";
import { setPreviousSong } from "../../reducers/LikedSongs";

const WebPlayBack = (props: any) => {

	const track = {
		name: "",
		album: { images: [{ url: "" }] },
		artists: [{ name: "" }]
	}

	const [player, setPlayer] = useState<any>(undefined);
	const [is_paused, setPaused] = useState(false);
	const [is_active, setActive] = useState(false);
	const [current_track, setTrack] = useState(track);
	const uris = useSelector((state: any) => state.LikedSongs.uris);
	const previousSong = useSelector((state: any) => state.LikedSongs.previousSong);
	const deviceId = useSelector( (state: any) => state.DeviceInfo.deviceId);

	const filterSelectedUris = (offset:string) => {
        const offsetId = uris.indexOf(offset); 
        return (
            uris.reduce( (acumulator:string[], current:string, currentIndex:number) => {
                if(offsetId <= currentIndex){
                   acumulator.push(current) 
                }
                return acumulator;
            }, [] )
        )
    }

	const [playResume] = usePlayResumeMutation({})

	const playPrevSong = () => {
		store.dispatch(setPreviousSong());
		playResume({ uris: filterSelectedUris(previousSong), deviceId:deviceId });
	}

	useEffect(() => {

		const script = document.createElement("script");
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;
		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {

			const player = new window.Spotify.Player({
				name: 'Web Playback SDK',
				getOAuthToken: (cb: any) => { cb(props.token); },
				volume: 0.5
			});

			setPlayer(player);

			player.addListener('ready', ({ device_id }: any) => {
				console.log('Ready with Device ID', device_id);
				store.dispatch(DeviceInfo.actions.setDeviceId(device_id))
			});

			player.addListener('not_ready', ({ device_id }: any) => {
				console.log('Device ID has gone offline', device_id);
				player.disconnect();
			});

			player.addListener('player_state_changed', ((state: any) => {

				if (!state) {
					return;
				}

				if(state.track_window.next_tracks.length === 0){
					console.log("ARREGLO TERMINADO");
				}

				setTrack(state.track_window.current_track);
				setPaused(state.paused);

				player.getCurrentState().then((state: any) => {
					(!state) ? setActive(false) : setActive(true)
					store.dispatch(DeviceInfo.actions.setIsActive(!!state))
				});

			}));

			player.connect();

		};

		return (
			player?.disconnect()
		)

	}, []);

	return (
		!player ? <div>Cargando Reproductor...</div> :
			<div className="spotify-container">
				<div className="spotify-main-wrapper">
					<div className="left-side-player">
						<img src={current_track?.album.images[0].url}
							className="now-playing__cover" alt="" />

						<div className="now-playing__side">
							<div className="now-playing__name ">
								<span>
									{current_track?.name}
								</span>
							</div>

							<div className="now-playing__artist">{
								current_track?.artists[0].name
							}</div>
						</div>
					</div>

					<div className="spacer" />

					<div className="btn-container">
						{/* <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
							<GiPreviousButton />
						</button> */}

						<button className="btn-spotify" onClick={() => { playPrevSong() }} disabled={!is_active} >
							<GiPreviousButton />
						</button>

						<button className="btn-spotify" onClick={() => { player.togglePlay() }} disabled={!is_active} >
							{is_paused ? <FaPlay /> : <FaPause />}
						</button>

						<button className="btn-spotify" onClick={() => { player.nextTrack() }} disabled={!is_active} >
							<GiNextButton />
						</button>
					</div>

					<div className="spacer" />

					<div className="right-side-player">
					</div>
				</div>
			</div>
	)
}

export default WebPlayBack;
