import React, { useState, useEffect, useReducer } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

export default function ProposalBoard() {
  const [proposals, setProposals] = useState();

  useEffect(() => {
    const options = {
      method: 'GET',
      url: 'http://localhost:8000/api/proposal'
    }

    axios.request(options)
      .then(res => {
        setProposals(res.data);
      })
      .catch(err => console.error(err));
  }, [setProposals]);

  return (
    <section className="container d-flex justify-content-center">
      <div className="col-8">
        <div className="card m-5 bg-light">
          <div className="card-body">
            <h5 className="card-title">Top Course Proposals</h5>
            <p className="card-text">Click Each Proposal to learn more and vote!</p>
            <CourseProposalList proposals={proposals} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseProposalList(props) {
  let proposals;

  if (props.proposals) {
    proposals = props.proposals.map((proposal, index) => {
      return <CourseModal proposal={proposal} key={index} />;
    })
  }
  
  return (
    <ul className="list-group">
      {proposals}
    </ul>
  )
}

function CourseModal(props) {
  const proposal = props.proposal;
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [show, setShow] = useState(false);

  const voteThreshold = 10;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleVote = () => {
    const options = {
      method: 'PUT',
      url: `http://localhost:8000/api/proposal/${proposal.id}`,
      data: {
        support: ++proposal.support
      }
    };

    axios.request(options)
      .then(res => handleClose())
      .catch(err => console.error(err));

    if (proposal.support >= voteThreshold) {
      createCourse();
    }
  }

  const createCourse = () => {
    const options1 = {
      method: 'POST',
      url: `http://localhost:8000/api/agorum`,
      data: {
        name: proposal.title
      }
    }

    axios.request(options1)
      .then(res => {
        console.log(res)
        const options2 = {
          method: 'POST',
          url: `http://localhost:8000/api/agorum/${res.data.id}/course`,
          data: {
            name: proposal.title
          }
        }
        axios.request(options2)
        .then(res => {
          console.log(res)
          const options3 = {
            method: 'DELETE',
            url: `http://localhost:8000/api/proposal/${proposal.id}`,
          }
          axios.request(options3)
            .then(res => console.log(res))
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
    
    forceUpdate()
  }

  return (
    <>
      <li variant="primary" className="list-group-item btn" onClick={handleShow}>
        <div className="row">
          <div className="col">
            {proposal.title ? proposal.title : "No title"}
          </div>
          <div className="col">
            <p>Votes: {proposal.support}/{voteThreshold}</p>
          </div>
        </div>
      </li>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{proposal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {proposal.description}
          <p>Creator: {proposal.contributors}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleVote}>
            Vote
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
