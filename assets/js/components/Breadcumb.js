import React, { Component } from 'react';

class Breadcumb extends Component {

    render() {

        const prefix_breadcumb = "/img/bg/breadcumb-area";
        const id = Math.floor(Math.random() * 3) + 1;
        return (
                <section className="breadcumb-area bg-img bg-overlay"
                         style={{backgroundImage: "url("+prefix_breadcumb+id+".jpg)"}}>
                    <div className="bradcumbContent" style={{backgroundColor: "#ededed"}}>
                        <p className="text-dark">{this.props.p_text}</p>
                        <h2>{this.props.title}</h2>
                    </div>
                </section>
        )
    }
}

export default Breadcumb;