import React from 'react';
import './mainContainer.css'

const MainContainer = ({ children }: any) => {
    return (
        <div className="main-container">
            {children}
        </div>
    );
}

export default MainContainer;