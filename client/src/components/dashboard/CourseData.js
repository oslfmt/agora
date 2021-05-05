import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CourseData(props) {
  const [proposals, setProposals] = useState(null);

  // count contains the total proposals made by the user thus far
  const count = props.proposalCount;
  const mysky = props.mysky;

  // retrieve all course proposals and set to component state
  // this effect is dependent on the props.proposalCount, since that value takes time to load since it a request
  // to skynet
  useEffect(() => {
    async function getCourseProposals() {
      try {
        let array = []; // local array to store proposals

        // retrieve all the course proposals that the user has made, using the global count variable
        for (let proposal = 0; proposal < count.proposalCount; proposal++) {
          const { data } = await mysky.getJSON(`localhost/proposals/proposal${proposal}.json`);
          array.push(data);
        }

        // set react state to the proposals
        setProposals(array);
      } catch(err) {
        console.error(err);
      }
    }

    if (count) {
      getCourseProposals();
    }
  }, [count, mysky]);

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
        {proposals ? <CourseProposalsList proposals={proposals} /> : null}
      </div>
    </div>
  );
}

const CourseProposalsList = (props) => {
  let proposals;
  console.log(props.proposals)

  if (props.proposals) {
    proposals = props.proposals.map((proposal, index) => {
      return <Link className="list-group-item btn" key={index} to={`/editcourse`}>{proposal.title}</Link>
    });
  }
  
  return (
    <ul className="list-group">
      {proposals}
    </ul>
  );
}

export default CourseData;