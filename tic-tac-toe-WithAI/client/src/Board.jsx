import React, {Component} from 'react'
import {Grid, Cell} from 'react-mdl'
import BoardParams from './BoardParams'
import Card from 'material-ui/Card'
import GridButton from './GridButton'
import request from 'superagent'
import UserType from './UserType'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import ConstSet from './ConstSet'
import GameStat from './GameStat'
import ColorManager from './ColorManager'
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class Board extends Component {
  constructor() {
    super();
    var size = BoardParams.WIDTH * BoardParams.HEIGHT * BoardParams.LAYERNUM;
    this.state = {
      grids: Array(size).fill(null),
      colors: Array(size).fill(ColorManager.BACKGROUND),
      roomName: ConstSet.NULL,
      alSet: false,
      showRB: true,
      over: false,
      timeout: false,
    }
    this.onChange = this.onChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRBClick = this.handleRBClick.bind(this);
    this.lastP2Pos = null;
  }
  
  onChange(event) {
    this.setState({
      roomName: event.target.value,
      grids: this.state.grids
    }) 
  }

  renderSquare(i) {
    var colW = 12 / BoardParams.WIDTH;
    return(  
      <Cell key={i} col={colW} phone={colW}>
        <GridButton color={this.state.colors[i]}
           value={this.state.grids[i]} 
           onClick={() => this.handleClick(i)}/>
      </Cell>
    )
  }

  showRBbutton() {
    return(
    <div>
      <div>
        <TextField
          floatingLabelText="text room name"
          onChange={this.onChange} />
      </div>
      <div id="raisedbutton" className="button-line">
        <RaisedButton label="set Room Name" onClick={() => this.handleRBClick()} primary/>
      </div>
    </div>
    )
  }
  
  showResButton() {
    return(
      <div>
        <RaisedButton label="restart" onClick={() => this.handleResClick()} primary />
      </div>
    )
  }
  
  handleResClick() {
    var url = '/api/restartGame';
    var self = this;
    request
      .post(url)
      .send({roomName: self.state.roomName})
      .set('Accept', 'application/json')
      .end(function(err, res){
        if (res.body.success) {
          var size = BoardParams.WIDTH * BoardParams.HEIGHT * BoardParams.LAYERNUM;
          var grids = new Array(size).fill(null);
          var colors = new Array(size).fill(ColorManager.BACKGROUND);
          self.setState({grids: grids, colors: colors, over: false, timeout: false});
        } else {
          window.alert("fail to restart, please refresh the page!");
        }
      });
  }

  handleRBClick() {
    var self = this;
    var url = '/api/startGame';
    request
      .post(url)
      .send({roomName: self.state.roomName})
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err) {
          console.log('set room name error');
        } else if (!res.body.success){
          window.alert("name already exists, use another name!");
        } else {
          self.setState(
           {alSet: true,
            showRB: false}
          )
        }
      })
  }

  render() {
    var board = [];
    var num = 12 / BoardParams.LAYERNUM;
    for (var i = 0; i < BoardParams.LAYERNUM; i++) {
      var baseL = i * BoardParams.HEIGHT * BoardParams.WIDTH;
      var layer = [];
      for (var j = 0; j < BoardParams.HEIGHT; j++) {
        var row = [];
        var baseW = baseL + j * BoardParams.WIDTH;
        for (var m = 0; m < BoardParams.WIDTH; m++){
          var baseG = baseW + m;
          row.push(this.renderSquare(baseG));
        }
        layer.push(<Grid key={baseW}>{row}</Grid>);
      }
      board.push(<Cell key={baseL} col={num}><Card>{layer}</Card></Cell>)
    }
    var rbButton = null;
    var resButton = null;
    if (this.state.showRB) {
      rbButton =  this.showRBbutton();
    }
    
    if (this.state.over || this.state.timeout) {
      resButton = this.showResButton();
    }

    return (
     <div>
      <Grid>
        {board}
      </Grid>
      <Grid>
        <Cell col={5}/>
        <Cell col={2}>
          {rbButton}
          {resButton}
        </Cell>
        <Cell col={5}/>
      </Grid>
     </div>
    )
  }

  
  handleClick(pos) {
    if (!this.state.alSet) {
      window.alert("set the roomName first");
    } else if (!this.state.over && !this.state.timeout && this.state.grids[pos]==null) {
      var url = '/api/next';
      var self = this;
      request
        .post(url)
        .send({pos: pos, roomName: self.state.roomName})
        .set('Accept', 'application/json')
        .end(function(err, res){
          if (err) {
            console.log('something wrong happened');
          } else {
            if (res.body.status === GameStat.PLAYER1WIN) {
              self.remindRes(res.body.posNums, ColorManager.SELF);
              self.setGameOver();
            } else if (res.body.status === GameStat.PLAYER2WIN) {
              self.remindRes(res.body.posNums, ColorManager.OPPLAST);
              self.setGameOver();
            } else if (res.body.status === GameStat.DRAW) {
              self.remindDraw();
              self.setGameOver();
            } else if (res.body.status === GameStat.TIMEOUT) {
              self.setGameOver();
              self.setTimeOut();
              window.alert("time out, please restart");
            }

            if (res.body.pos !== ConstSet.NULL) {
              self.renderGrid(res.body.pos, UserType.AI);
              if (res.body.status === GameStat.UNFINISHED){
                self.setColor(self.lastP2Pos, ColorManager.BACKGROUND);
                self.setColor(res.body.pos, ColorManager.OPPLAST);
                self.lastP2Pos = res.body.pos;
              }
            }

            if (res.body.status !== GameStat.TIMEOUT) {
              self.renderGrid(pos, UserType.CLIENT);
            }
          }
      })
    }
  }
  
  setColor(lastP2Pos, color) {
    if (lastP2Pos !== null) {
      const colors = this.state.colors.slice();
      colors[lastP2Pos] = color;
      this.setState({colors: colors});
    }
  }

  setGameOver() {
    this.setState({over: true})
  }
  
  setTimeOut() {
    this.setState({timeout: true});
  }

  remindRes(posNums, color) {
    const colors = this.state.colors.slice();
    for (var i = 0; i < posNums.length; i++) {
      colors[posNums[i]] = color;
    }
    this.setState({colors: colors});
  }
  

  remindDraw() {
    window.alert("the game is draw");
  }

  renderGrid(pos, type) {
    const grids = this.state.grids.slice();
    if (type===UserType.CLIENT){
      grids[pos]='x';
    } else{
      grids[pos]='o'
    }
    this.setState({grids: grids});
  }
}

export default Board;