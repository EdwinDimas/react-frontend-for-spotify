import './playlist.css';
import { PlayListItem, PlayListsInt } from "./Types";
import Heart from '../../assets/images/heart.png';
import { elementTypes } from '../PlayListMenu/elementTypes';

interface PlayListType {
    play_lists : PlayListsInt
    liked_songs_total: number
    setVisible: any
}

const PlayLists = ({play_lists, liked_songs_total, setVisible}:PlayListType) => {
    const { items } = play_lists;

    const setPlayListVisible = () => {

    }

    const setLikedSongsVisible = () => {
        setVisible(elementTypes.LIKEDSONGS);
    }

    const setMenuVisible = () => {
        setVisible(elementTypes.PLAYLIST_MENU)
    }

    return (
        <div className={"playList-container"}>
            <div className="row">
                <div className={"play-list-item"} onClick={setLikedSongsVisible}>
                <img src={Heart} alt="Playlist Cover" />
                    <h5>{"My Tracks"}</h5>
                    <p>{"All the songs you like"}</p>
                    <div className={"track-counter"}>
                        <p>{liked_songs_total} items</p>
                    </div>
                </div>
                {items.map((item: PlayListItem, key: number) => {
                    return (
                        <div className={"play-list-item"} key={key} onClick={setPlayListVisible}>
                            <img src={item.images[0].url} alt="Playlist Cover" />
                            <h5>{item.name}</h5>
                            <p>{item.description}</p>
                            <div className={"track-counter"}>
                                <p>{item.tracks.total} items</p>
                            </div>
                        </div>

                    )
                })
                }
            </div>
        </div>
    )
}

export default PlayLists