import { Button } from 'react-bootstrap';
import { LOGIN_SERVER_URL } from '../services/config';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from 'react';

const Login = () => {

    const navigate = useNavigate();

    //Get tokens from url parameters.
    const [searchParams] = useSearchParams();
    const token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');

    useEffect(() => {

        const storedToken = localStorage.getItem('token');
        const storedRefreshToken = localStorage.getItem('refresh_token');

        if (storedToken && storedRefreshToken) {
            navigate('/dashboard');
        }

        if (token && refresh_token) {
            localStorage.setItem('token', token);
            localStorage.setItem('refresh_token', refresh_token);
            navigate('/dashboard');
        }

    }, [token, refresh_token]);

    const LoginRedirect = () => {
        window.location.href = `${LOGIN_SERVER_URL}/login`;
    }

    return (
        <div>
            <h1>Login Into React FrontEnd for Spotify</h1>
            <Button variant="primary" onClick={LoginRedirect}>Login</Button>
        </div>
    );
}

export default Login;