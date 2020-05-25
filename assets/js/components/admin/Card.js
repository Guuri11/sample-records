import React, { Component } from 'react';

class Card extends Component {

    render() {
        return (
            <div className="col-xl-12 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-sr text-uppercase mb-1">{this.props.title}</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{this.props.data}</div>
                            </div>
                            <div className="col-auto">
                                <i className={this.props.icon+" fa-2x text-gray-300"}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
export default Card;