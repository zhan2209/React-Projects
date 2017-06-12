import React, { Component } from 'react';
import { Link } from 'react-router'
import request from 'superagent';

class CoursesGridModule extends React.Component {
  render () {
    return (
      <div>
        <Grid>
          <Col md={2}></Col>
          <Col md={8}>
            <Col xs={6} md={4}>
              <Thumbnail src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/3a/867bd0352d11e48277ab05289070ba/large-icon.png" alt="242x200">
                <h3>Probabilistic Graphical Models</h3>
                <p>Description</p>
                <p>
                  <Button bsStyle="primary">Button</Button>
                  <Button bsStyle="default">Button</Button>
                </p>
              </Thumbnail>
            </Col>
            <Col xs={6} md={4}>
              <Thumbnail src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/3a/867bd0352d11e48277ab05289070ba/large-icon.png" alt="242x200">
                <h3>Probabilistic Graphical Models</h3>
                <p>Description</p>
                <p>
                  <Button bsStyle="primary">Button</Button>
                  <Button bsStyle="default">Button</Button>
                </p>
              </Thumbnail>
            </Col>
            <Col xs={6} md={4}>
              <Thumbnail src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/3a/867bd0352d11e48277ab05289070ba/large-icon.png" alt="242x200">
                <h3>Probabilistic Graphical Models</h3>
                <p>Description</p>
                <p>
                  <Button bsStyle="primary">Button</Button>
                  <Button bsStyle="default">Button</Button>
                </p>
              </Thumbnail>
            </Col>
          </Col>
          <Col md={2}></Col>
        </Grid>
      </div>
    );
  }
}

export default CoursesGridModule;
