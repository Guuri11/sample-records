import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";

class SRMusic extends Component {
    render() {
        return (
            <div className={"bg-sr full-screen"}>
                <Title title={"SR - SR MUSIC"}/>
                <Header active={"srmusic"} sticky={true}/>

                <div className="container-fluid section-padding-100-0">
                    <div className="row">
                        <div className="col-12 col-md-2">
                            <div className="single-widget-area bg-white height-500 menu-sr-music">
                                <div className="widget-title one-day">
                                    <h3><strong>Menu</strong></h3>
                                </div>
                                <div className="widget-content">
                                    <ul>
                                        <li><a href="#"><h4 className="menu-item-sr-music"><span
                                            className="fa fa-home"/> Inicio</h4></a></li>
                                        <li><a href="#"><h4 className="menu-item-sr-music"><span
                                            className="fa fa-music"/> Artistas</h4></a></li>
                                        <li><a href="#"><h4 className="menu-item-sr-music"><i
                                            className="fas fa-compact-disc"/> Albums</h4></a></li>
                                    </ul>
                                </div>
                            </div>
                            <br/><br/>
                        </div>

                        <div className="col-12 col-md-9 content-area-sr-music">
                            <br/>
                            <div className="row">
                                <div className="col-12 col-md-3">
                                    <input className="form-control sf-input" placeholder="Buscar..."/>
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-12 col-md-4">
                                    <h3 className="title one-day"><strong>Luisaker</strong></h3>
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-4 col-md-2">
                                    <img src="/img/albums/delaossa-unperroandaluz.jpg" className="img-fluid"/>
                                </div>
                                <div className="col-8 col-md-10">
                                    <label>2019</label>
                                    <h2 className="title">Un perro andaluz</h2>
                                </div>
                            </div>
                            <br/>

                            <div className="row table-sr-music">
                                <div className="col-12">
                                    <div style={{height: 300, overflow: "auto"}}>
                                        <table className="table">
                                            <thead>
                                            <tr>#</tr>
                                            <tr/>
                                            <tr>TÍTULO</tr>
                                            <tr/>
                                            </thead>
                                            <tbody>
                                            <tr><td>1</td>
                                                <td>
                                                    <span className="fa fa-heart-o"/>
                                                </td>
                                                <td>Disposable Heroes - Live At The Masonic, San Francisco, CA -
                                                    November 3rd, 2018
                                                </td>
                                                <td>7:30</td></tr>
                                            <tr><td>2</td>
                                                <td>
                                                    <span className="fa fa-heart-o"/>
                                                </td>
                                                <td>When A Blind Man Cries - Live At The Masonic, San Francisco, CA -
                                                    November 3rd, 2018
                                                </td>
                                                <td>4:34</td></tr>
                                            <tr><td>3</td>
                                                <td>
                                                    <span className="fa fa-heart-o"/>
                                                </td>
                                                <td>The Unforgiven - Live At The Masonic, San Francisco, CA - November
                                                    3rd, 2018
                                                </td>
                                                <td>7:20</td></tr>
                                            <tr><td>4</td>
                                                <td>
                                                    <span className="fa fa-heart-o"/>
                                                </td>
                                                <td>Please Dont't Judas Me - Live At The Masonic, San Francisco, CA -
                                                    November 3rd, 2018
                                                </td>
                                                <td>8:03</td></tr>
                                            <tr><td>5</td>
                                                <td>
                                                    <span className="fa fa-heart-o"/>
                                                </td>
                                                <td>Turn The Page - Live At The Masonic, San Francisco, CA - November
                                                    3rd, 2018
                                                </td>
                                                <td>6:22</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row fixed current-song">
                        <div className="col-12 col-md-2">
                            <br/>
                            <div className="img-box-sr-music" id="img-current-img-box">
                                <img src="/img/albums/delaossa-unperroandaluz.jpg" id="current-img" className="img-fluid"/>
                            </div>
                            <div className="current-title">
                                <label className={"title-song"}>Si tu perro</label>
                            </div>
                            <div className="current-artist">
                                <label className={"artist-song"}>Metallica</label>
                            </div>
                            <br/>
                        </div>
                        <div className="col-12 col-md-10">
                            <div className="play-area-sr-music">
                                <audio preload="auto" controls>
                                    <source src="/songs/babi-colegas.mp3"/>
                                </audio>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
export default SRMusic;