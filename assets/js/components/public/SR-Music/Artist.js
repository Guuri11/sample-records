import React, { Component } from 'react';
import axios from "axios";
import PropTypes from "prop-types";


class Artist extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        artist: this.props.artist,
        songs: [],
        albums: [],
        loading: true
    }

    static propTypes = {
        albums: PropTypes.array,
        artist: PropTypes.object.isRequired,
        songs: PropTypes.array,
        handleSong: PropTypes.func
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            const {artist} = this.state;
            this.getSongs(artist);
            this.getAlbums(artist);
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    /* API REQUESTS */

    getSongs(artist) {
        axios.get(`/api/v1.0/song/?artist=${artist.id}`).then(res => {
            if (res.data.success === true){
                this._isMounted && this.setState( { songs: res.data.results, loading: false } );
            }
        }).catch(e => {});
    }

    getAlbums(artist) {
        axios.get(`/api/v1.0/album/?artist=${artist.id}`).then(res => {
            if (res.data.success === true){
                this._isMounted && this.setState( { albums: res.data.results, loading: false } );
            }
        }).catch(e => {});
    }

    // Calling parent function to change the song component
    handleChangeSong = (song) => {
        this.props.handleSong(song);
    }

    handleAlbum = (section,album) => {
        this.props.selectAlbum(section, album);
    }

    render() {
        const { artist ,albums, songs, loading } = this.state;

        return (
            loading ?
                null
                :

                <div className="row">
                    <div className="row">
                        <div className="col-4 col-md-2">
                            <img src={artist.img_name} className="img-fluid"/>
                        </div>
                        <div className="col-8 col-md-10">
                            <h2 className="title">{artist.alias}</h2>
                        </div>
                    </div>
                    {
                        albums.length > 0 ?
                            <div className="row table-sr-music">
                                <h3 className={"one-day mt-2"}>Albums</h3>
                                <div className="col-12">
                                    <div style={{height: 300, overflow: "auto"}}>
                                        <table className="table">
                                            <thead>
                                            <tr><th className={"font-weight-bolder"}>#</th>
                                                <th className={"font-weight-bolder"}>TÍTULO</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                albums.map((album,idx) => {
                                                    return (
                                                        <tr key={idx}><td className={"pointer font-weight-bolder"}>{idx+1}</td>
                                                            <td className="pointer font-weight-bolder" onClick={this.handleAlbum.bind(this,album)}>{album.name}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        songs.length > 0 ?
                            <div className="row table-sr-music">
                                <h3 className={"one-day ml-3"}> Canciones</h3>
                                <div className="col-12">
                                    <div style={{height: 300, overflow: "auto"}}>
                                        <table className="table">
                                            <thead>
                                            <tr><th className={"font-weight-bolder"}>#</th>
                                                <th/>
                                                <th className={"font-weight-bolder"}>TÍTULO</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                songs.map((song,idx) => {
                                                    // Get song duration in secons and minutes
                                                    const minutes = Math.floor(song.duration / 60);
                                                    const seconds = song.duration - minutes * 60;
                                                    return (
                                                        <tr key={idx}><td className={"pointer font-weight-bolder"} onClick={this.handleChangeSong.bind(this,song)}>{idx+1}</td>
                                                            <td><span className="fa fa-music"/></td>
                                                            <td className="pointer font-weight-bolder" onClick={this.handleChangeSong.bind(this,song)}>{song.name}</td>
                                                            <td>{minutes}:{seconds}</td></tr>
                                                    )
                                                })
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                    }
                </div>

        );
    }

}
export default Artist;