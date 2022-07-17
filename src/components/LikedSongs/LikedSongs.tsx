import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetLikedSongsQuery, usePlayResumeMutation } from "../../services/UsersAndSongs";
import BaseTable from "../BaseTable/BaseTable";
import { LikedSongsItem } from "../playlists/Types";
import { store } from "../../redux/store";
import { updateItems, incrementPageCounter, setCurrentSong } from "../../reducers/LikedSongs";
import "./LikedSongs.css"
import { FaHeart } from "react-icons/fa";
import { RiArrowGoBackFill } from "react-icons/ri";
import { elementTypes } from "../PlayListMenu/elementTypes";

interface LikedSongsInt {
    setVisible: any
}

const LikedSongs = ({setVisible}:LikedSongsInt) => {

    const limitPerRequest = 30;
    const device_id = useSelector((state: any) => state.DeviceInfo.device_id);
    const items = useSelector((state: any) => state.LikedSongs.items);
    const uris = useSelector((state: any) => state.LikedSongs.uris);
    const pageCounter = useSelector((state: any) => state.LikedSongs.pageCounter);
    const { data: likedSongs, isLoading: isLoadingLiked } = useGetLikedSongsQuery({ offset: limitPerRequest * pageCounter, limit: limitPerRequest }, { refetchOnMountOrArgChange: true });
    
    const setPlayListMenuVisible = () => {
        setVisible(elementTypes.PLAYLIST_MENU)
    }

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

    useEffect(() => {
        if (likedSongs && !isLoadingLiked) {
            const { items } = likedSongs;
            store.dispatch(updateItems(items))
        }
    }, [likedSongs, isLoadingLiked])

    const [playResume] = usePlayResumeMutation({})

    const onDoubleClickHandler = (e: any, row: any, index: any) => {
        store.dispatch(setCurrentSong(row.uri))
        playResume({ uris: filterSelectedUris(row.uri), device_id: device_id })
    }

    const onScroll = (e: any) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        const totalSongs = likedSongs?.total;
        if (bottom && totalSongs > limitPerRequest * (pageCounter + 1)) {
            store.dispatch(incrementPageCounter())
        }
    }

    return (
        <div onScroll={onScroll} className={"scrollable"}>
            <div className="LikedSongs-header">
                <h3> <FaHeart/> Liked Songs</h3>
                <div className="separator"/>
                <h4> 
                    <span onClick={setPlayListMenuVisible} style={{cursor:"pointer"}}>
                        <RiArrowGoBackFill/> Volver
                    </span>
                </h4>
            </div>
            <BaseTable
                columnNames={[
                    { dataField: "track", text: "Track" },
                    { dataField: "artist", text: "Artist" },
                    { dataField: "album", text: "Album" },
                    { dataField: "uri", text: "uri" }
                ]}
                data={items.map((item: LikedSongsItem, key: number) => {
                    return {
                        track: item.track.name,
                        album: item.track.artists[0].name,
                        artist: item.track.album.name,
                        uri: item.track.uri
                    }
                })}
                onDoubleClickHandler={onDoubleClickHandler}
            />
        </div>
    )
}

export default LikedSongs;