import React, { Component, useState } from 'react'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import axios from 'axios'

class EditCourse extends Component {
  state = {
    courses: {}
  }

  componentDidMount() {
    const { id } = this.props.params;
    const options = {
      method: 'GET',
      url: `http://localhost:8000/api/course/${id}`
    }

    axios.request(options)
      .then(res => {
        const course = res.data
        this.setState({ course })
      })
      .catch(err => console.error(err));
  }
  
  render() {
    var sections;
    if (this.state.course) {
      sections = this.state.course.coursesections;
      console.log(sections);
    } else {
      sections = [];
    }
    return (
      <div>
      <HomeNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-8">
          <div className="card m-5 bg-light">
            <div className="card-body">
              <h5 className="card-title">Edit or create a new page</h5>
              <ul className="list-group">
              { sections.map((page, index) => <li variant="primary" className="list-group-item btn"><Link className="nav-link" to={`/editsection/${page.id}`}>{index+1}</Link></li>)}
              </ul>
            </div>
            <button className="btn btn-success" onClick="">Add Section</button>
          </div>
        </div>
      </section>
    </div>
    )
  }
}

export default (props) => (
  <EditCourse
      {...props}
      params={useParams()}
  />
);

const HomeNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-color">
      <div className="container-fluid">
        <div className="navbar-nav">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/proposals">Proposals</Link>
          <Link className="nav-link" to="/browse">Browse</Link>
          <Link className="nav-link" to="/about">About</Link>
          <Link className="nav-link" to="/dashboard">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}