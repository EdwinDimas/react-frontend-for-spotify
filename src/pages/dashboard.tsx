import { useGetUsuarioQuery } from '../services/UsersAndSongs';
import ProfileSide from '../components/profileSide/profileSide';
import MainContainer from '../components/mainContainer/mainContainer';
import PlayListMenu from '../components/PlayListMenu/PlayListMenu';
import WebPlayBack from '../components/Player/WebPlayback';
import './dashboard.css'

const Dashboard = () => {

	const { data: userData, isLoading } = useGetUsuarioQuery({});
	const token: string = localStorage.getItem("token") ?? ""

	return (
		isLoading ? <div>Loading...</div> :
			<MainContainer>
				<div className="dashboard-profile">
					<ProfileSide {...userData} />
				</div>
				<div className="dashboard-body">
					<PlayListMenu user_id={userData.id} />
				</div>
				<div className="dashboard-player">
					<WebPlayBack token={token} />
				</div>
			</MainContainer>
	);
}

export default Dashboard;