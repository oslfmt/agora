import React from 'react';
import { Link } from 'react-router-dom'

function Profile(props) {
  return (
    <div className="card mb-4" style={{'height': '300px'}}>
      <div className="card-body flex-column d-flex">
        <h5 className="card-title">Profile</h5>
        <p>SkynetID: </p>
        <p>Users must take this course to gain their first set of tokens, which unlocks other courses</p>
        <Link className="btn btn-success mb-3" to="/introcourse">Take Intro Course</Link>
        <Link className="btn btn-primary" to="/proposecourse">Propose A New Course</Link>
      </div>
    </div>
  );
}

export default Profile;