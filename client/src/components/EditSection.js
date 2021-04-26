import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import MDEditor from '@uiw/react-md-editor';
import axios from 'axios'

export default function EditSection() {
  const [course, setCourse] = useState(0)
  const courseid = useParams();
  const [value, setValue] = useState("placeholder");

  useEffect(() => {
    const options = {
      method: 'GET',
      url: `http://localhost:8000/api/course/${courseid.id}`
    }

    axios.request(options)
      .then(res => {
        setCourse(res.data)
      })
      .catch(err => console.error(err));
  }, [setCourse]);  

  useEffect(() => {
    if (course) {
      setValue(course.coursesections[0].content)
    }
  }, [course])

  // const postContent = () => {
  //   const options = {
  //     method: 'PUT',
  //     url: `http://localhost:8000/api/section/${sectionid.id}`,
  //     data: {
  //       content: value
  //     }
  //   }
  
  //   axios.request(options)
  //     .then(res => {
  //       console.log(res)
  //     })
  //     .catch(err => console.error(err));
  // }

  var sections;
  if (course) {
    sections = course.coursesections;
    console.log(sections);
  } else {
    sections = [];
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col card p-4 m-3">
          <ul className="list-group">
            { sections.map((page, index) => <li variant="primary" onClick={() => setValue(course.coursesections[index].content)} className="list-group-item btn mb-3">Page {index+1}</li>)}
          </ul>
        </div>
        <div className="col-10 card p-4 m-3">
          <MDEditor
            value={value || ''}
            preview={'edit'}
            height={700}
            onChange={setValue}
          />
          <button className="btn btn-success">Save Changes</button>
        </div>
      </div>
    </div>
  );
}