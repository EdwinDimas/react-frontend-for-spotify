import { useGetPlayListsQuery, useGetLikedSongsQuery } from '../../services/UsersAndSongs';
import PlayLists from '../playlists/PlayLists';
import LikedSongs from '../LikedSongs/LikedSongs';
import { useState } from 'react';
import { elementTypes } from './elementTypes';
import "./PlayListMenu.css"


interface menuProps {
    user_id: string
}

const PlayListMenu = ({ user_id }: menuProps) => {

    const { data: playlists, isLoading } = useGetPlayListsQuery({ user_id });
    const { data: likedSongs, isLoading: isLoadingLiked } = useGetLikedSongsQuery({ offset: 0, limit:1 }, { refetchOnMountOrArgChange: true });
    const [visibleElement, setVisibleElement] = useState<string>(elementTypes.PLAYLIST_MENU)

    const renderElement = (visible:string) =>{
        switch (visible) {
            case elementTypes.LIKEDSONGS:
                return <LikedSongs setVisible={setVisibleElement}/>
            case elementTypes.PLAYLIST:
                return <></>
            case elementTypes.PLAYLIST_MENU:
                return <PlayLists 
                            play_lists={playlists} 
                            liked_songs_total={likedSongs.total} 
                            setVisible={setVisibleElement}
                        />;
            default:
                return <></>
        }
    }

    return (
        isLoading || isLoadingLiked ? <div>Loading...</div> :
            <div className="auto-scroll">
               {renderElement(visibleElement)}
            </div>
            
    )
}

export default PlayListMenu;
