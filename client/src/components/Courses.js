import React, { Component, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Course from './Course'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default class Courses extends Component {
  state = {
    courses: []
  }

  componentDidMount() {
    axios.get(`http://localhost:8000/api/course`)
      .then(res => {
        var courses = res.data
        this.setState({ courses });
        console.log(courses)
      })
  }
  
  render() {
    console.log(this.state.courses)
    return (
      <div>
        <section className="container d-flex justify-content-center">
          <div className="col-8">
            <div className="card m-5 bg-light">
              <div className="card-body">
                <h5 className="card-title">Top Courses</h5>
                <ul className="list-group">
                { this.state.courses.map(course => <li variant="primary" className="list-group-item btn"><Link className="nav-link" to={`/editcourse/${course.id}`}>{course.name}</Link></li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}