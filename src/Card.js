import React from "react";

// pull the src and name from what Card was passed
function Card({ src, name }) {
    // return the card image with the image source and name as the alt
    return (
        <img className="Card-image" src={src} alt={name} />
    )
}

export default Card;