import React, { Component } from 'react';
import Pagination from "react-js-pagination";
import PropTypes from 'prop-types';


class Table extends Component{

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        title: this.props.title,
        subtitle: this.props.subtitle,
        columns: this.props.columns,
        entity: this.props.entity,
        data: this.props.data,
        data_keys: this.props.data_keys,
        active_page : 1,
        data_per_page: 10,
    }

    renderColumns = (columns) => {
        return columns.map( (column, idx) => {
            return (
                <th key={idx}>{column}</th>
            )
        })
    }

    render() {

        const { active_page, data_per_page, data, data_keys,title, subtitle, columns, entity} = this.state;

        // Logic for pagination
        const indexLastEvent = active_page * data_per_page;
        const indexFirstEvent = indexLastEvent - data_per_page;
        const currentData = data.slice(indexFirstEvent, indexLastEvent);

        return(
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h4 className="m-0 font-weight-bold text-primary">{title}</h4>
                    {
                        subtitle ?
                            <h6 className="m-0 font-weight-bold text-primary">{subtitle}</h6>
                            :
                            null
                    }
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <div className="row">
                            <div className="col-sm-12 col-md-6">
                                <div className="dataTables_length" id="dataTable_length"><label>Show <select
                                    name="dataTable_length" aria-controls="dataTable"
                                    className="custom-select custom-select-sm form-control form-control-sm">
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="25">25</option>
                                    <option value="30">30</option>
                                </select> entries</label></div>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <div id="dataTable_filter" className="dataTables_filter">
                                    <label>Search:
                                        <input type="search" className="form-control form-control-sm" placeholder=""
                                            aria-controls="dataTable"/>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <table className="table table-bordered" id="dataTable" width="100%"
                               cellSpacing="0">
                            <thead>
                            <tr>
                                {this.renderColumns(columns)}
                            </tr>
                            </thead>
                            <tfoot>
                            <tr>
                                {this.renderColumns(columns)}
                            </tr>
                            </tfoot>
                            <tbody>
                            { this.props.children }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        )
    }
}

Table.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    columns: PropTypes.array.isRequired,
    entity: PropTypes.string,
    data: PropTypes.array.isRequired,
    data_keys: PropTypes.array.isRequired
};

Table.defaultProps = {
    title: '',
    subtitle: '',
    columns: [],
    entity: '',
    data: [],
    data_keys: []
}

export default Table;