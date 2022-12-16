import { useState, useEffect } from 'react';

import YoutubeVideoCard from './YoutubeVideoCard';

import './App.css';
import SearchIcon from './search.svg';

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [youtubeVideos, setYoutubeVideos] = useState([]);

    const searchYoutubeVideos = async (title) => {
        fetch(`/showYoutubeVideos/${title}`).then(
            response => response.json()
        ).then(
            data => { setYoutubeVideos(data.youtubeVideos) }
        )  
    }

    useEffect(() => {
        fetch("/showYoutubeVideos").then(
            response => response.json()
        ).then(
            data => { setYoutubeVideos(data.youtubeVideos) }
        )
    }, []);

    
    return (
        <div className="app">
            <h1>Motivation Hub</h1>

            <div className="search">
                <input
                    placeholder="Search for motivational youtube videos"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <img 
                    src={SearchIcon}
                    alt="search"
                    onClick={() => searchYoutubeVideos(searchTerm)}
                />
            </div>

            {youtubeVideos?.length > 0
                ? (
                    <div className="container">
                        {youtubeVideos.map((video) => <YoutubeVideoCard youtubeVideo={video} />)}
                    </div>
                ) : (
                    <div className="empty">
                        <h2>No videos found</h2>
                    </div>
                )}
        </div>
    );
}

export default App;