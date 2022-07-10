import { BsPersonFill } from 'react-icons/bs'
import Spotify_logo from '../../assets/images/Spotify_Logo_RGB_Green.png'
import './profileSide.css'

interface explicitProps {
    filter_enabled: boolean;
    filter_locked: boolean;
}

interface followersProps {
    href: string;
    total: number;
}

interface imageProps {
    url: string;
    width: number;
    height: number;
}

export interface profileProps {
    display_name: string;
    country: string;
    email: string;
    explicit_content: explicitProps;
    followers: followersProps;
    href: string;
    images: imageProps[];
    product: string;
    [x: string | number | symbol]: unknown;
}

const ProfileSide = (props: profileProps) => {
    console.log(props)
    return (
        <div className="profile-side">

            <div className='top-left'>
                <img src={Spotify_logo} alt="" className="spotify-logo" />
            </div>
            <div className='top-middle'>
            </div>
            <div className="top-right">
                <div className="profile-pic">
                    <BsPersonFill fontSize="8vh" style={{ color: "#ebebeb" }} />
                </div>
                <div className='top-right__text'>
                    <p>{props.display_name}</p>
                    <p>{props.product === "premium" ? "Premium" : "Free"} | {props.country}</p>
                </div>
            </div>

        </div>
    )
}

export default ProfileSide;