import React, { Component } from 'react';
import axios from 'axios';

class ProposalForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      contributors: '',
      categories: '',
      files: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.uploadToSkynet = this.uploadToSkynet.bind(this);
  }

  // is async making 'this' undefined? because this works in other methods
  async uploadToSkynet() {
    try {
      // returns the skylink, which is used to retrieve the specific content that has been uploaded
      const { skylink } = await this.props.skynetClient.uploadFile(this.state.files[0]);

      // generate a url
      const skylinkUrl = await this.props.skynetClient.getSkylinkUrl(skylink);
      console.log(skylinkUrl);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Creates an course template in p/courseProposalName
   */
  async handleSubmit() {
    const courseProposal = {
      title: this.state.title,
      description: this.state.description,
      contributors: this.state.contributors,
      categories: this.state.categories,
    };

    try {
      // setJSON to the given datapath, which starts at '0' and increments up
      const { data, skylink } = await this.props.mysky.setJSON(this.props.dataPath, courseProposal);

      console.log(data)
      console.log(skylink)
    } catch (err) {
      console.error(err);
    }

    // ========= CENTRALIZED BACKEND STUFF ============= //
    const options = {
      method: 'POST',
      url: 'http://localhost:8000/api/proposal',
      data: courseProposal
    }

    // axios.request(options)
    //   .then(res => console.log(res))
    //   .catch(err => console.log(err));
    // ========= CENTRALIZED BACKEND STUFF ============= //

    // reset the form, increment proposal count
    this.setState({
      title: '',
      description: '',
      contributors: '',
      categories: '',
    });
  }

  handleInputChange(e) {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.name;

    this.setState({
      [name]: value
    });
  }

  handleFileUpload(e) {
    const fileList = e.target.files;
    let files = [];

    for (let i = 0; i < fileList.length; i++) {
      files.push(fileList[i]);
    }

    this.setState({ files });
  }

  render() {
    return (
      <div className="container">
        <div className="Proposal_container">
          <h1 className="Proposal_title">Propose a Course.</h1>
          <div className="Topic_goal">
            <div className="Topic_div">
            <label for="exampleFormControlInput1" className="Form_label">Course Title</label>
            <input type="topic" class="form-control" name="title" placeholder="Subject 101" value={this.state.title} onChange={this.handleInputChange}/>
            </div>
            <div className="Goal_div">
              <label for="exampleFormControlInput2" className="Form_label">Vote Goal</label>
              <input type="goal" class="form-control" placeholder="100" readOnly/>
            </div>
          </div>
          <div className="Desc_div">
            <label for="exampleFormControlInput3" className="Form_label">Course Description</label>
            <textarea type="desc" class="form-control" name="description" value={this.state.description} placeholder="Course Description..." onChange={this.handleInputChange}/>
          </div>
          <div className="Contributor_deadline">
            <div className="Contributors_div">
              <label for="exampleFormControlInput4" className="Form_label">Course Contributors</label>
              <input type="contributor" class="form-control" name="contributors" value={this.state.contributors} onChange={this.handleInputChange} />
            </div>
            <div className="Deadline_div">
              <label for="exampleFormControlInput5" className="Form_label">Voting Days</label>
              <input type="deadline" class="form-control" id="exampleFormControlInput5" placeholder="30" readOnly/>
            </div> 
          </div>
          <div className="Categories_div">
            <label for="exampleFormControlInput6" className="Form_label">Category</label>
            <input type="categories" class="form-control" name="categories" placeholder="Enter one category your course falls..." value={this.state.categories} onChange={this.handleInputChange}/>
          </div>
          <div className="input-group">
            <input id="fileItem" type="file" onChange={this.handleFileUpload} multiple/>
          </div>
          <div className="Button_div m-5">
            <button type="submit" class="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
            <button type="submit" class="btn btn-primary" onClick={this.uploadToSkynet}>Upload File</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ProposalForm;