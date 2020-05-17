import React, { Component } from 'react';
import axios from "axios";
import PropTypes from "prop-types";


class Album extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        album: this.props.album,
        songs: [],
        loading: true
    }

    static propTypes = {
        album: PropTypes.object.isRequired,
        handleSong: PropTypes.func
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            const {album} = this.state;
            this.getSongs(album);
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    /* API REQUESTS */

    getSongs(album) {
        axios.get(`/api/v1.0/song/?album=${album.id}`).then(res => {
            if (res.data.success === true){
                this._isMounted && this.setState( { songs: res.data.results, loading: false } );
            }
        }).catch(e => {});
    }

    // Calling parent function to change the song component
    handleChangeSong = (song) => {
        this.props.handleSong(song);
    }

    render() {
        const { album, songs, loading } = this.state;
        const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        const day = album ? new Date(album.released_at.date).getDate():null;
        const month = album ? new Date(album.released_at.date).getMonth():null;
        const year = album ? new Date(album.released_at.date).getFullYear() : null;

        return (
            loading ?
                null
                :

                <div className="row">
                    <div className="col-12 col-md-4">
                        <h3 className="title one-day"><strong>{album.artist.alias}</strong></h3>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-4 col-md-2">
                            <img src={album.img_name} className="img-fluid"/>
                        </div>
                        <div className="col-8 col-md-10">
                            <label>{months[month]} {day}, {year}</label>
                            <h2 className="title">{album.name}</h2>
                        </div>
                    </div>
                    <br/>
                    <div className="row table-sr-music">
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
                </div>

        );
    }

}
export default Album;