import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import ChipInput from 'material-ui-chip-input';
import request from 'superagent';
import {Grid, Cell} from 'react-mdl';

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      inputText: '',
      search: true,
      toggleText: 'Text Search',
      dataSource: [],
    };
  }

  componentDidMount() {
    var self = this;
    request
      .post('/api/getalltags')
      .send({})
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err || !res.ok) {
         console.log('Oh no! error', err);
        } else {
          self.setState({dataSource: res.body});
        }
      });
  }

  changeText = (event) => {
    this.setState({ inputText: event.target.value });
  };

  handleToggle = (event) => {
    this.setState({
      toggleText: this.state.search ? 'Tags Filter' : 'Text Search',
      search: !this.state.search,
    });
  };

  clickSearch = () => {
    this.props.search(this.state.inputText);
    this.setState({ inputText: '' });
  };

  render () {
    return (
      <Grid>
        <Cell col={2}></Cell>
        <Cell col={2}>
          <Toggle
            toggled={this.state.search}
            onToggle={this.handleToggle}
            labelPosition="right"
            label={this.state.toggleText}
          />
        </Cell>
        {
          this.state.search ?
            <Cell col={8}>
              <TextField
                style={{marginLeft: 20}}
                name="search"
                onChange={this.changeText}
                value={this.state.inputText}
              />
              <RaisedButton
                style={{marginLeft: 20}}
                label="Search"
                primary={true}
                onTouchTap={this.clickSearch}
                />
            </Cell> :
            <Cell col={8}>
              <ChipInput
                value={this.props.tags}
                onRequestAdd={(chip) => this.props.addTag(chip)}
                dataSource={this.state.dataSource}
                onRequestDelete={(chip) => this.props.deleteTag(chip)}
              />
            </Cell>
        }
      </Grid>
    );
  }
}

export default Search;
