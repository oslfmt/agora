import React from 'react';
import { Link } from 'react-router-dom';
import ProposalForm from './ProposalForm';
import CourseList from './CourseList';


function Proposals() {
    return (
      <section className="proposals">
        <div className="container">
            <ProposalForm />
        </div>
      </section>
    );
  }

  export default Proposals;