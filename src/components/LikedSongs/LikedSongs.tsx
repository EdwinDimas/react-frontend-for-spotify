import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetLikedSongsQuery, usePauseMutation, usePlayResumeMutation } from "../../services/UsersAndSongs";
import BaseTable from "../BaseTable/BaseTable";
import { LikedSongsItem } from "../playlists/Types";
import { store } from "../../redux/store";
import { updateItems, incrementPageCounter } from "../../reducers/LikedSongs";
import "./LikedSongs.css"
import { FaHeart, FaPause, FaPlay } from "react-icons/fa";
import { RiArrowGoBackFill } from "react-icons/ri";
import { elementTypes } from "../PlayListMenu/elementTypes";

interface LikedSongsInt {
    setVisible: any
}

const LikedSongs = ({ setVisible }: LikedSongsInt) => {

    const limitPerRequest = 30;
    const device_id = useSelector((state: any) => state.DeviceInfo.device_id);
    const items = useSelector((state: any) => state.LikedSongs.items);
    const uris = useSelector((state: any) => state.LikedSongs.uris);
    const currentSong = useSelector((state: any) => state.LikedSongs.currentSong);
    const pageCounter = useSelector((state: any) => state.LikedSongs.pageCounter);
    const isPaused = useSelector((state: any) => state.LikedSongs.paused);

    const { data: likedSongs, isLoading: isLoadingLiked } = useGetLikedSongsQuery({ offset: limitPerRequest * pageCounter, limit: limitPerRequest }, { refetchOnMountOrArgChange: true });
    // const { data: currentlyPlaying } = useCurrentlyPlayingQuery({}, { pollingInterval: 5000 })
    const [pause] = usePauseMutation();
    const [playResume, {error:errorPlaying}] = usePlayResumeMutation();

    const [currentIndex, setCurrentIndex] = useState<number>();

    const setPlayListMenuVisible = () => {
        setVisible(elementTypes.PLAYLIST_MENU)
    }

    useEffect(() => {
        if (likedSongs && !isLoadingLiked) {
            const { items } = likedSongs;
            store.dispatch(updateItems(items))
        }
    }, [likedSongs, isLoadingLiked])

    const onDoubleClickHandler = (e: any, row: any, index: any) => {
        playResume({ uris: uris, offset: { "position": index }, device_id: device_id })
    }

    const onScroll = (e: any) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        const totalSongs = likedSongs?.total;
        if (bottom && totalSongs > limitPerRequest * (pageCounter + 1)) {
            store.dispatch(incrementPageCounter())
        }
    }

    const genImgPreview = (url: string) => {
        return <img src={url} alt="" height="48px" />
    }

    const convertMsToMins = (ms: number) => {
        const totalSecs = Math.round(ms / 1000);
        const mins = Math.trunc(totalSecs / 60);
        const secs = Math.round(totalSecs % 60);
        let result = "";

        if (mins < 10) result += "0" + mins;
        else result += mins;
        result += ":";
        if (secs < 10) result += "0" + secs;
        else result += secs;

        return result;
    }

    const generatePlayButton = (isPlaying: boolean, isCurrent: boolean, index: number) => {
        return <button className="btn-playresume"  onClick={() => {
            if (isPlaying) {
                if(!isCurrent){
                    playResume({
                        uris: uris,
                        offset: { "position": index },
                        device_id: device_id,
                    })
                } else {
                    pause({ device_id })
                }
                
            } else {
                if(isCurrent){
                    playResume({ device_id: device_id })
                    if(errorPlaying){
                        playResume({
                            uris: uris,
                            offset: { "position": index },
                            device_id: device_id,
                        })
                    }
                } else {
                    playResume({
                        uris: uris,
                        offset: { "position": index },
                        device_id: device_id,
                    })
                }
            }
        }}>{isCurrent && isPlaying ? <FaPause /> : <FaPlay />}</button>
    }

    return (
        <div onScroll={onScroll} className={"scrollable"}>
            <div className="LikedSongs-header">
                <h3> <FaHeart /> Liked Songs</h3>
                <div className="separator" />
                <h4>
                    <span onClick={setPlayListMenuVisible} style={{ cursor: "pointer" }}>
                        <RiArrowGoBackFill /> Return
                    </span>
                </h4>
            </div>
            <BaseTable
                currentSong={currentSong}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                columnNames={[
                    { dataField: "play", text: "" },
                    { dataField: "image", text: "" },
                    { dataField: "track", text: "Track", classes: "track-name-col" },
                    { dataField: "artist", text: "Artist", classes: "artist-name-col" },
                    { dataField: "album", text: "Album", classes: "album-name-col" },
                    { dataField: "date_added", text: "Release Date", classes: "release-date-col" },
                    { dataField: "duration", text: "Duration", classes: "duration-col" },
                    { dataField: "uri", text: "uri", hidden: true }
                ]}
                data={items.map((item: LikedSongsItem, key: number) => {
                    const isCurrent = currentSong?.uri === item.track.uri || currentSong?.name === item.track.name ;
                    return {
                        play: generatePlayButton(!isPaused, isCurrent, key),
                        image: genImgPreview(item.track.album.images[2]?.url),
                        track: item.track.name,
                        artist: item.track.artists[0].name,
                        album: item.track.album.name,
                        date_added: item.track.album.release_date,
                        duration: convertMsToMins(item.track.duration_ms),
                        uri: item.track.uri
                    }
                })}
                onDoubleClickHandler={onDoubleClickHandler}
            />
        </div>
    )
}

export default LikedSongs;