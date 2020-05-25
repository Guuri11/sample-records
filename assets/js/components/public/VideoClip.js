import React, { Component } from 'react';

class VideoClip extends Component {
    render() {

        const { id_videoclip, idx_song, src_videoclip } = this.props;

        return (
                <div className="modal fade" id={id_videoclip} tabIndex="-1" role="dialog" aria-labelledby={idx_song}
                     aria-hidden="false">
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <iframe width="560" height="315" src={src_videoclip}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen className={"videoclip"}></iframe>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}
export default VideoClip;