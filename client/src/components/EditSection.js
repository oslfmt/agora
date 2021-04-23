import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import MDEditor from '@uiw/react-md-editor';
import axios from 'axios'

export default function EditSection() {
  const [section, setSection] = useState(0)
  const sectionid = useParams();
  const [value, setValue] = useState("placeholder");

  useEffect(() => {
    const options = {
      method: 'GET',
      url: `http://localhost:8000/api/section/${sectionid.id}`
    }

    axios.request(options)
      .then(res => {
        setSection(res.data)
      })
      .catch(err => console.error(err));
  }, [setSection]);  

  useEffect(() => {
    setValue(section.content)
  }, [section])
  

  const postContent = () => {
    const options = {
      method: 'PUT',
      url: `http://localhost:8000/api/section/${sectionid.id}`,
      data: {
        content: value
      }
    }
  
    axios.request(options)
      .then(res => {
        console.log(res)
      })
      .catch(err => console.error(err));
  }

  return (
    <div className="container">
      <div className="card p-4 m-5">
        <h4 className="card-title">Edit Page</h4>
        <MDEditor
          value={value || ''}
          onChange={setValue}
        />
      </div>
      <button className="btn btn-success" onClick={postContent}>Save Changes</button>
    </div>
  );
}

