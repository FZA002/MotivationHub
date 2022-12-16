import React from 'react';

const YoutubeVideoCard = ({ youtubeVideo }) => {
    return (
        <div className="youtubeVideo">
            
            <div>
                <iframe width="560" height="315" src={youtubeVideo.videoURL}></iframe>
            </div>

            <div>
                <h3>{youtubeVideo.videoName}</h3>
            </div>

        </div>
    );
}

export default YoutubeVideoCard;

