import React, { Component } from 'react';

class Comment extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        const { idx, img, name, surname, comment} = this.props
        return (
            <div key={idx} className="comment-box">
                <span className="commenter-pic mb-3">
                  <img src={"/img/users/profile/"+img} className="img-fluid"/>
                </span>
                <span className="commenter-name">
                    <a href="#">{name.charAt(0).toUpperCase() + name.slice(1)} {surname ? surname.charAt(0).toUpperCase() + surname.slice(1):'' }</a>
                    <span className="comment-time">2 hours ago</span>
                </span>
                <p className="comment-txt more">{comment}</p>
            </div>

        );
    }
}
export default Comment;