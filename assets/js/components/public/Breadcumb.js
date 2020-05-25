import React, { PureComponent } from 'react';

class Breadcumb extends PureComponent {

    render() {

        const prefix_breadcumb = "/img/bg/breadcumb-area";
        const id = Math.floor(Math.random() * 6) + 1;
        return (
            this.props.profile ?
                <section className="breadcumb-area bg-img bg-overlay"
                         style={{backgroundImage: "url(/img/users/header/"+this.props.header_user+")"}}/>
                :
                <section className="breadcumb-area bg-img bg-overlay"
                         style={{backgroundImage: "url("+prefix_breadcumb+id+".jpg)"}}>
                    <div className="bradcumbContent" style={{backgroundColor: "#f4f4f4"}}>
                        <p className="text-dark">{this.props.p_text}</p>
                        <h2>{this.props.title}</h2>
                    </div>
                </section>
        )
    }
}

export default Breadcumb;