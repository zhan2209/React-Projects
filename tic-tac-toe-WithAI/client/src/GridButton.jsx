import React, {Component} from 'react';
import style from './GridStyle';

class GridButton extends Component {
  constructor() {
    super();
    this.state = {
      value: null
    }
  }
  
  render() {
    // the following copy way will change style object
    var newStyle = Object.assign(style, {backgroundColor: this.props.color});
    return (
      <span>
        <button 
         style={newStyle} 
         onClick={() => this.props.onClick()}>
           {this.props.value}
        </button>
      </span>
    )
  }
}
export default GridButton