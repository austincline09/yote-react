import React, { PropTypes } from 'react'

import Base from "../BaseComponent.js.jsx";


class TextInput extends Base {


  constructor(props) {
    super(props);
    this._bind('_handleInputChange');

  }
  // check the props the component receives
  componentWillReceiveProps(nextProps) {
    // console.log("TextInput props");
    // console.log(nextProps);
  }
  _handleInputChange(e) {
    // console.log("handleinputchange");
    // console.log(e);
    this.props.change(e);
  }
  render() {
    const { label, value, placeholder, name, required } = this.props;
    return (
      <div className="input-group">
        <label htmlFor={name}> {label} </label>
        <input
          type={this.props.password ? "password" : "text"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={this._handleInputChange}
          required={required}
        />
      </div>
    )
  }
}

TextInput.propTypes = {
  label: PropTypes.string
  , value: PropTypes.string
  , placeholder: PropTypes.string
  , name: PropTypes.string
  , required: PropTypes.bool
  , change: PropTypes.func
  , password: PropTypes.bool
}

export default TextInput;
