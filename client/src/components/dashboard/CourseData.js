import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CourseData(props) {
  const skynet = props.skynet;
  const [proposals, setProposals] = useState('');

  // POSTGRESQL IMPLEMENTATION
  // useEffect(() => {
  //   const options = {
  //     method: 'GET',
  //     url: 'http://localhost:8000/api/proposal'
  //   }

  //   axios.request(options)
  //     .then(res => {
  //       setProposals(res.data);
  //     })
  //     .catch(err => console.error(err));
  // }, [setProposals]);

  // SKYNET IMPLEMENTATION: get courses
  useEffect(() => {
    async function getCourseProposals() {
      if (skynet.mysky) {
        try {
          const { data, skylink } = await skynet.mysky.getJSON(skynet.dataPath);

          setProposals(data)
        } catch(err) {
          console.error(err);
        }
      }
    }

    getCourseProposals();
  }, [setProposals])

  return (
    <div className="card bg-light" style={{"height": "650px"}}>
      <div className="card-body">
        <h5 className="card-title">Courses</h5>
        <ul className="list-group">
          <li className="list-group-item">An item</li>
          <li className="list-group-item">A second item</li>
          <li className="list-group-item">A third item</li>
          <li className="list-group-item">A fourth item</li>
          <li className="list-group-item">And a fifth one</li>
        </ul>
        <h5 className="card-title mt-3">My Created Course</h5>
        <li className="list-group-item">
          <p>Proposal Title: {proposals.title}</p>
          <p>Description: {proposals.description}</p>
          <p>Contributors: {proposals.contributors}</p>
          <p>Category: {proposals.categories}</p>
        </li>
        {/* <CourseProposalsList proposals={proposals} /> */}
      </div>
    </div>
  );
}

const CourseProposalsList = (props) => {
  let proposals;
  console.log(props.proposals)

  if (props.proposals) {
    proposals = props.proposals.map((proposal, index) => {
      return <Link className="list-group-item btn" key={index} to={`/editcourse:${proposal.id}`}>{proposal.title}</Link>
    });
  }
  
  return (
    <ul className="list-group">
      {proposals}
    </ul>
  )
}

export default CourseData;