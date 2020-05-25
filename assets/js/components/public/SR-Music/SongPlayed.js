import React, { Component } from 'react';

class SongPlayed extends Component {
    render() {

        const {song} = this.props

        return (
            <div className="row fixed current-song">
                <div className="col-12 col-md-2">
                    <br/>
                    <div className="img-box-sr-music" id="img-current-img-box">
                        <img src={song.img_name} id="current-img" className="img-fluid"/>
                    </div>
                    <div className="current-title">
                        <label className={"title-song"}>{song.name}</label>
                    </div>
                    <div className="current-artist">
                        <label className={"artist-song"}>{song.artist.alias}</label>
                    </div>
                    <br/>
                </div>
                <div className="col-12 col-md-10">
                    <div className="play-area-sr-music">
                        <audio preload={"auto"} controls ref="audio">
                            <source src={"/songs/"+song.song_file}/>
                        </audio>
                    </div>
                </div>
            </div>
        );
    }
}
export default SongPlayed;