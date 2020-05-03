import React, { Component } from 'react';

class Search extends Component {

    render() {
        return (
            <div>
                <div className="modal fade" id="searchModal" tabIndex="-1" role="dialog" aria-labelledby="title-search" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title" id="title-search">¿Quieres algo en concreto? Búscalo por aquí</h3>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="input-group md-form form-sm form-1 pl-0">
                                    <button className="btn btn-primary">
                                        <span className="fa fa-search"/>
                                </button>
                                    <input className="form-control my-0 py-1" id="searchHeader" type="text" aria-label="Search"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Search;