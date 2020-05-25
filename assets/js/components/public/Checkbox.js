import React from 'react'

export const CheckBox = props => {
    return (
        <li key={props.id}>
            <label><input onClick={props.handleCheckChieldElement} className={props.classCheckBox} type="checkbox" checked={props.isChecked} value={props.value} />{props.value}</label>
        </li>
    )
}

export default CheckBox;