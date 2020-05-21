import React, { Component } from 'react';

class BoxArea extends Component{
    render() {
        return (
            <div className={"box-area"}>
                {this.props.children}
            </div>
        )
    }
}
export default BoxArea;