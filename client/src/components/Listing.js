import React from 'react';
import './Listing.scss';

const Listing = (props) => {


    return (
        <div className="card-container">
            <div><a href={props.link}><img className="image" src={props.image} alt={props.title} /></a>
            </div>
            <h3>$ {props.price}</h3>
            <h1>{props.title}</h1>
            <div>
                <p>{props.state}</p>
                <p>{props.city}</p>
               
            </div>
        </div>
    )
}

export default Listing
