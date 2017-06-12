import React from 'react'
import request from 'superagent';

import CourseCard from './CourseCard';
import Auth from './Auth'
import Search from './Search'
import {Grid} from 'react-mdl';

class CourseDiscover extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      username : Auth.getUserName(),
      tags: {},
    };
  }

  componentDidMount() {
    var self = this;
    request
     .post('/api/getallcourses')
     .send({})
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if (err || !res.ok) {
         console.log('Oh no! error', err);
       } else {
        self.setState({data: res.body});
      }
    });
  }

  handleSearch = (keywords) => {
    var self = this;
    request
     .post('/api/getallcourses')
     .send({keywords: keywords})
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if (err || !res.ok) {
         console.log('Oh no! error', err);
       } else {
        self.setState({data: res.body});
      }
    });
  };

  filter = () => {
    var self = this;
    request
     .post('/api/getallcourses')
     .send({tags: Object.keys(this.state.tags)})
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if (err || !res.ok) {
         console.log('Oh no! error', err);
       } else {
         self.setState({data: res.body});
      }
    });
  };

  addTag = (chip) => {
    var chips = this.state.tags;
    chips[chip] = 1;
    this.setState({ tags: chips });
    this.filter();
  };

  deleteTag = (chip) => {
    var chips = this.state.tags;
    delete chips[chip];
    this.setState({ tags: chips });
    this.filter();
  };

  render () {
    var cards = this.state.data.map((ele) =>
      <CourseCard
        id={ele.id}
        key={ele.id}
        courseName={ele.name}
        photoUrl={ele.photoUrl}
        url={ele.url}
        description={ele.description}
        bookmark={ele}
        needExpand={true}
        username={this.state.username}
        sharedBy={Object.keys(ele.username).length}
        marked={this.state.username in ele.username}
        tags={Object.keys(ele.tags)}
      />
    );
    return (
      <div>
        <Search
          search={this.handleSearch}
          addTag={this.addTag}
          deleteTag={this.deleteTag}
          tags={Object.keys(this.state.tags)}
        />
        <Grid>
          {cards}
        </Grid>
      </div>
    );
  }
}

export default CourseDiscover;
