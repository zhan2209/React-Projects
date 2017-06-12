import React from 'react';
import request from 'superagent';

import CourseCard from './CourseCard';
import AddCourse from './AddCourse';
import Auth from './Auth';
import {Grid} from 'react-mdl';

class CoursesDisplay extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {},
      username : Auth.getUserName(),
    };
  }

  componentDidMount() {
    this.getCourses();
  }

  getCourses() {
    var self = this;
    request
     .post('/api/display')
     .send({ username: this.state.username })
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if (err || !res.ok) {
         console.log('Oh no! error', err);
       } else {
        var data = {};
        res.body.map((ele) =>
          data[ele._id] = ele
        );
        self.setState({ data: data });
      }
    });
  }

  needUpdate() {
    this.getCourses();
  };

  delete(id) {
    request
      .post('/api/delete')
      .send({ id: id })
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err || !res.ok) {
          console.log('Oh no! error', err);
        }
      });
    var data = this.state.data;
    delete data[id];
    this.setState({data: data});
  }

  render () {
    const data = this.state.data;
    var cards = Object.keys(data).map((key) =>
      <CourseCard
        id={data[key]._id}
        key={data[key]._id}
        courseName={data[key].name}
        photoUrl={data[key].photoUrl}
        url={data[key].url}
        needExpand={false}
        description={data[key].description}
        delete={this.delete.bind(this, data[key]._id)}
        edit={true}
        tags={data[key].tags}
        />
    );

    return (
      <div>
        <Grid>
          {cards}
        </Grid>
        <AddCourse
          username={this.state.username}
          needUpdate={this.needUpdate.bind(this)}
        />
      </div>
    );
  }
}

export default CoursesDisplay;
