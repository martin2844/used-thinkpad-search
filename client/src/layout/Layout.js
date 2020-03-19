import React from 'react'
import Navbar from './Navbar';
import './layout.scss';

const Layout = (props) => {
    return (
        <div className="main-wrapper">
             <Navbar/>
            <div className="content-wrapper">
           
            {props.children}
            </div>
            
        </div>
    )
}

export default Layout
