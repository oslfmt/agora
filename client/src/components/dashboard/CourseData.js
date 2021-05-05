import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CourseData(props) {
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
        {/* {proposals ? <CourseProposalsList /> : null} */}
      </div>
    </div>
  );
}

// const CourseProposalsList = (props) => {
//   let proposals;
//   console.log(props.proposals)

//   if (props.proposals) {
//     proposals = props.proposals.map((proposal, index) => {
//       return <Link className="list-group-item btn" key={index} to={`/editcourse`}>{proposal.title}</Link>
//     });
//   }
  
//   return (
//     <ul className="list-group">
//       {proposals}
//     </ul>
//   );
// }

export default CourseData;