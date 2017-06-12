import React from 'react';
import {Card, CardActions, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Star from 'material-ui/svg-icons/toggle/star';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import request from 'superagent';
import {yellow500} from 'material-ui/styles/colors';
import Chip from 'material-ui/Chip';
import ChipInput from 'material-ui-chip-input';
import {Cell} from 'react-mdl';
import Toggle from 'material-ui/Toggle';
import {List, ListItem} from 'material-ui/List';

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

class CourseCard extends React.Component {
  constructor() {
    super();
    this.state = {
      content: {
        id: '',
        description: [],
      },
      modalOpen: false,
      marked: false,
      tags: {},
      dataSource: [],
      expanded: false,
      shareCount: 0,
    };
  }

  componentDidMount() {
    var otags = {};
    var self = this;
    this.props.tags.forEach((ele) => otags[ele] = 1);
    this.setState({
      content: {
        id: this.props.id,
        description: this.props.description,
      },
      marked: this.props.marked,
      tags: otags,
      shareCount: this.props.sharedBy,
    });
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

  modalOpen = () => {
    this.setState({modalOpen: true});
  };

  modalClose = () => {
    this.setState({modalOpen: false});
  };

  changeText = (event) => {
    const field = event.target.name;
    const content = this.state.content;
    content[field] = event.target.value;
    this.setState({
      content
    });
  };

  updateInfo = (field, value) => {
    const content = this.state.content;
    content[field] = value;
    this.setState({
      content
    });
  };

  bookmarkCourse = (event) => {
    var datas = this.props.bookmark;
    datas['username'] = this.props.username;
    var count = this.state.shareCount;
    count = count + (this.state.marked ? -1 : 1);
    if (this.state.marked) {
      request
       .post('/api/deletebookmark')
       .send(datas)
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if (err || !res.ok) {
          console.log('Oh no! error', err);
         } else {
          console.log(res.body);
        }
      });
    } else {
      request
       .post('/api/bookmark')
       .send(datas)
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if (err || !res.ok) {
          console.log('Oh no! error', err);
         } else {
          console.log(res.body);
        }
      });
    }
    this.setState({
      marked: !this.state.marked,
      shareCount: count,
    });
  };

  addTag = (chip) => {
    var chips = this.state.tags;
    chips[chip] = 1;
    this.setState({ tags: chips });
  };

  deleteTag = (chip) => {
    var chips = this.state.tags;
    delete chips[chip];
    this.setState({ tags: chips });
  };

  editCourse = (event) => {
    request
     .post('/api/editcourse')
     .send({
       content: this.state.content,
       tags: Object.keys(this.state.tags),
     })
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if (err || !res.ok) {
         console.log('Oh no! error', err);
       } else {
        console.log('res:', res);
      }
    });
    this.modalClose();
  };

  handleToggle = () => {
    this.setState({expanded: !this.state.expanded})
  };

  render () {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.modalClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.editCourse}
      />,
    ];
    const tagsForTap = Object.keys(this.state.tags).map((ele) =>
      <Chip
        key={ele}
        style={styles.chip}
      >
        {ele}
      </Chip>
    );

    var descriptions = [];

    if (this.props.needExpand) {
      var descState = this.state.content.description;
      descState.forEach((ele) => {if (ele !== "") {descriptions.push(ele)}});
      descriptions = descriptions.map(ele => {
        if (ele !== "") {return <ListItem key={ele} primaryText={ele} />}
      });
    }

    return (
      <Cell col={4}>
        <Card expanded={this.state.expanded}>
          <CardMedia
            overlay={<CardTitle title={this.props.courseName} />}
            >
            <img style={{height: 300}} src={this.props.photoUrl} alt="mooc" />
          </CardMedia>
          { this.props.needExpand && descriptions.length > 1 &&
            <CardText>
              <Toggle
                toggled={this.state.expanded}
                onToggle={this.handleToggle}
                labelPosition="right"
                label="See user descriptions"
              />
            </CardText>
          }
          { this.props.needExpand && descriptions.length > 1 ?
              <CardText expandable={true}>
                <List>
                  {descriptions}
                </List>
              </CardText> :
              <CardText>
                {this.state.content.description}
              </CardText>
          }
          <CardText>
            <div style={styles.wrapper}>
              {tagsForTap}
            </div>
          </CardText>
          {
            this.props.sharedBy &&
            <CardText>
              Shared By {this.state.shareCount} Users
            </CardText>
          }
          <CardActions>
            {
              this.props.delete &&
              <FlatButton
                label="Delete"
                onTouchTap={this.props.delete}
                primary={true}
                />
            }
            {
              this.props.edit &&
              <FlatButton
                label="Edit"
                onTouchTap={this.modalOpen}
                primary={true}
              />
            }
            {this.props.bookmark && (
              this.state.marked ?
                <RaisedButton
                  label="Bookmark"
                  labelPosition="after"
                  secondary={true}
                  icon={<Star color={yellow500} />}
                  style={{margin: 12}}
                  onTouchTap={this.bookmarkCourse}
                /> :
                <RaisedButton
                  label="Bookmark"
                  labelPosition="after"
                  primary={true}
                  icon={<Star />}
                  style={{margin: 12}}
                  onTouchTap={this.bookmarkCourse}
                />
            )}
            <a href={this.props.url}>More Info</a>
          </CardActions>
        </Card>
        <Dialog
          title="Edit your description"
          actions={actions}
          modal={false}
          open={this.state.modalOpen}
          onRequestClose={this.modalClose}
          >
          <div className="field-line">
            <TextField
              floatingLabelText="Input the description"
              name="description"
              onChange={this.changeText}
              value={this.state.content.description}
              />
          </div>
          <div className="field-line">
            <ChipInput
              value={Object.keys(this.state.tags)}
              onRequestAdd={(chip) => this.addTag(chip)}
              dataSource={this.state.dataSource}
              onRequestDelete={(chip) => this.deleteTag(chip)}
            />
          </div>
        </Dialog>
      </Cell>
    );
  }
}

export default CourseCard;
