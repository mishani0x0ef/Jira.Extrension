import React, { Component } from "react";

import PropTypes from "prop-types";
import { callIfExist } from "~/js/content/common/functionUtil";
import { classIf } from "~/js/content/common/reactUtil";

export class SquareCheckBoxGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checkedValue: null
        };
    }

    onChange(event) {
        const value = event.target.value;
        this.setState({ checkedValue: value });
        callIfExist(this.props.onChange, [value]);
    }

    render() {
        return (
            <div className="popup-section">
                <h4>{this.props.group}</h4>
                <div className="grid-row">
                    {this.props.values.map((value) => {
                        const key = `${this.props.group}_${value}`;
                        const isChecked = this.state.checkedValue === value;
                        return (
                            <div key={key} className={`grid-cell ${classIf(isChecked, "active")}`}>
                                <input type="radio"
                                    id={key}
                                    name={this.props.group}
                                    value={value}
                                    onChange={(e) => this.onChange(e)} />
                                <label htmlFor={key}>{value}</label>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

SquareCheckBoxGroup.propTypes = {
    values: PropTypes.array.isRequired,
    group: PropTypes.string,
    onChange: PropTypes.func,
}