import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { getLoggedInUser } from "../../helpers/authUtils";
import UploadCardPicture from "../../components/ImageWall";
import { getUser, getClient, getClients, addClient } from "../../redux/actions";
import Loader from "../../components/Loader";
import Input from "../../components/Input";
import * as moment from "moment";
import { nationalityOptions, titleOptions, raceOptions, OSoptions } from './options';

class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: getLoggedInUser(),
      title: "",
      nricName: "",
      preferredName: "",
      nric_passport: "",
      dob: "",
      age: 0,
      nextFollowUpDate: "",
      lastpurchasae: "",
      lastcontactdate: "",
      hobbies: "",
      maritalStatus: "",
      email: "",
      contact: "",
      contact2: "",
      race: "",
      nationality: "",
      familyrelationship: "",
      address: "",
      gender: "",
      category: "",
      family: null,
      annualExpense: "",
      monthlyExpense: "",
      annualShortTermSavings: "",
      monthlyShortTermSavings: "",
      annualIncome: "",
      monthlyIncome: "",
      companyaddress: "",
      companyname: "",
      occupation: "",
      referredsource: "",
      othersource: "",
      remarks: "",
      fileList: []
    };
  }

  setFileList = fileList => {
    this.setState({
      fileList
    });
  };
  componentDidMount() {
    this.props.getUser(this.state.user.id);
    this.props.getClients();
  }

  onChangeHandler = e => {
    const { name, value } = e.target;
    if (name === "dob") {
      this.setState({
        age: parseInt(new Date().getFullYear() - moment.utc(value).year())
      });
    }
    if (name === "annualExpense") {
      this.setState({
        [name]: parseFloat(Math.round(value * 100) / 100).toFixed(2),
        monthlyExpense: parseFloat(Math.round((value / 12) * 100) / 100).toFixed(2)
      });
    }
    if (name === "monthlyExpense") {
      this.setState({
        [name]: parseFloat(Math.round(value * 100) / 100).toFixed(2),
        annualExpense: parseFloat(Math.round(value * 12 * 100) / 100).toFixed(2)
      });
    }
    if (name === "annualShortTermSavings") {
      this.setState({
        [name]: parseFloat(Math.round(value * 100) / 100).toFixed(2),
        monthlyShortTermSavings: parseFloat(
          Math.round((value / 12) * 100) / 100
        ).toFixed(2)
      });
    }
    if (name === "monthlyShortTermSavings") {
      this.setState({
        [name]: parseFloat(Math.round(value * 100) / 100).toFixed(2),
        annualShortTermSavings: parseFloat(
          Math.round(value * 12 * 100) / 100
        ).toFixed(2)
      });
    }
    if (name === "annualIncome") {
      this.setState({
        [name]: parseFloat(Math.round(value * 100) / 100).toFixed(2),
        monthlyIncome: parseFloat(Math.round((value / 12) * 100) / 100).toFixed(
          2
        )
      });
    }
    if (name === "monthlyIncome") {
      this.setState({
        [name]: parseFloat(Math.round(value * 100) / 100).toFixed(2),
        annualIncome: parseFloat(Math.round(value * 12 * 100) / 100).toFixed(2)
      });
    }
    this.setState({ [name]: value });
  };

  onBlurHandler = e => {
    const { name, value } = e.target;

    this.setState({
      [name]: parseFloat(Math.round(value * 100) / 100).toFixed(2)
    });
  };

  handleFamily = e => {
    this.setState({
      family: e[0] ? { id: e[0].id, label: e[0].label } : null,
    });
  };
  handleRS = e => {
    this.setState({
      referredsource: e[0] ? { id: e[0].id, label: e[0].label } : null,
    });
  };
  handleOS = e => {
    this.setState({
      othersource: e[0]
    });
  };
  handleTitle = e => {
    this.setState({
      title: e[0]
    });
  };
  handleRace = e => {
    this.setState({
      race: e[0]
    });
  };
  handleNationality = e => {
    this.setState({
      nationality: e[0]
    });
  };
  onSubmitHandler = e => {
    e.preventDefault();

    const {
      title,
      nricName,
      preferredName,
      nric_passport,
      dob,
      age,
      nextFollowUpDate,
      lastpurchasae,
      lastcontactdate,
      hobbies,
      maritalStatus,
      email,
      contact,
      contact2,
      race,
      nationality,
      familyrelationship,
      address,
      gender,
      category,
      family,
      annualExpense,
      monthlyExpense,
      annualShortTermSavings,
      monthlyShortTermSavings,
      annualIncome,
      monthlyIncome,
      companyaddress,
      companyname,
      occupation,
      referredsource,
      othersource,
      remarks,
      fileList
    } = this.state;

    this.props.addClient(
      title,
      nricName,
      preferredName,
      nric_passport,
      dob,
      age,
      nextFollowUpDate,
      lastpurchasae,
      lastcontactdate,
      hobbies,
      maritalStatus,
      email,
      contact,
      contact2,
      race,
      nationality,
      familyrelationship,
      address,
      gender,
      category,
      family,
      annualExpense,
      monthlyExpense,
      annualShortTermSavings,
      monthlyShortTermSavings,
      annualIncome,
      monthlyIncome,
      companyaddress,
      companyname,
      occupation,
      referredsource,
      othersource,
      remarks,
      fileList
    );
  };

  render() {
    if (this.props.clientAdded._id) {
      return <Redirect to="/clients" />;
    }
    const options = this.props.clients.map(client => {
      return {
        id: client._id,
        label: client.nricName + " (" + client.preferredName + ")"
      };
    });
    return (
      <React.Fragment>
        <div className="">
          {/* preloader */}
          {this.props.loading && <Loader />}

          <Row>
            <Col>
              <div className="page-title-box">
                <Row>
                  <Col lg={7}>
                    <h4 className="page-title">Add Client</h4>
                  </Col>
                  <Col lg={5} className="mt-lg-3 mt-md-0"></Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <form onSubmit={this.onSubmitHandler}>
                    <Row>
                      <Col lg={12}>
                        <h4 className="page-title">Personal Info</h4>
                        <div style={{ margin: "25px 0px 20px 0px" }}>
                          <span
                            style={{
                              display: "block",
                              border: "none",
                              color: "white",
                              height: "1px",
                              background:
                                "-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 350, from(#000), to(#fff))"
                            }}
                          ></span>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Full Name in NRIC"
                          type="text"
                          name="nricName"
                          onChange={this.onChangeHandler}
                          value={this.state.nricName}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Preferred Name *"
                          type="text"
                          name="preferredName"
                          onChange={this.onChangeHandler}
                          value={this.state.preferredName}
                          required
                        />
                      </Col>
                      <Col lg={4}>
                        <div style={{ marginBottom: "15px" }}>
                          <label>Title</label>
                          <Typeahead
                            id="Title"
                            multiple={false}
                            options={titleOptions}
                            onChange={this.handleTitle}
                            placeholder="Choose a Title..."
                          />
                        </div>
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Date of Birth "
                          type="date"
                          name="dob"
                          onChange={this.onChangeHandler}
                          value={this.state.dob}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="NRIC / Passport No. "
                          type="text"
                          name="nric_passport"
                          onChange={this.onChangeHandler}
                          value={this.state.nric_passport}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Age "
                          type="number"
                          name="age"
                          onChange={this.onChangeHandler}
                          value={this.state.age}
                        />
                      </Col>
                      <Col lg={4}>
                        <div className="form-group">
                          <label>Gender *</label>
                          <select
                            name="gender"
                            className="form-control"
                            defaultValue={""}
                            onChange={this.onChangeHandler}
                            required
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div style={{ marginBottom: "15px" }}>
                          <label>Race</label>
                          <Typeahead
                            id="Race"
                            multiple={false}
                            options={raceOptions}
                            onChange={this.handleRace}
                            placeholder="Choose a Race.."
                          />
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div style={{ marginBottom: "15px" }}>
                          <label>Nationality</label>
                          <Typeahead
                            id="Nationality"
                            multiple={false}
                            options={nationalityOptions}
                            onChange={this.handleNationality}
                            placeholder="Choose a Nationality.."
                          />
                        </div>
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Occupation"
                          type="text"
                          name="occupation"
                          onChange={this.onChangeHandler}
                          value={this.state.occupation}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Hobbies / Interest"
                          type="text"
                          name="hobbies"
                          onChange={this.onChangeHandler}
                          value={this.state.hobbies}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Marital Status "
                          type="text"
                          name="maritalStatus"
                          onChange={this.onChangeHandler}
                          value={this.state.maritalStatus}
                        />
                      </Col>
                      <Col lg={4}>
                        <div className="form-group">
                          <label>Category</label>
                          {this.props.user.categories ? (
                            <select
                              name="category"
                              className="form-control"
                              defaultValue={""}
                              onChange={this.onChangeHandler}
                            >
                              <option value="">Select Category</option>
                              {this.props.user.categories.map((category, i) => (
                                <option value={category} key={i}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          ) : (
                              <Input
                                label="Category"
                                type="text"
                                name="category"
                                onChange={this.onChangeHandler}
                                value={this.state.category}
                              />
                            )}
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div style={{ marginBottom: "15px" }}>
                          <label>Family of</label>
                          <Typeahead
                            id="family"
                            multiple={false}
                            options={options}
                            onChange={this.handleFamily}
                            placeholder="Choose a family..."
                          />
                        </div>
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Family Relationship"
                          type="text"
                          name="familyrelationship"
                          onChange={this.onChangeHandler}
                          value={this.state.familyrelationship}
                        />
                      </Col>
                      <Col lg={4}>
                        <div style={{ marginBottom: "15px" }}>
                          <label>Introduced by</label>
                          <Typeahead
                            id="referredsource"
                            multiple={false}
                            options={options}
                            onChange={this.handleRS}
                            placeholder="Choose a Introduced by..."
                          />
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div style={{ marginBottom: "15px" }}>
                          <label>Lead Source</label>
                          <Typeahead
                            id="othersource"
                            multiple={false}
                            options={OSoptions}
                            onChange={this.handleOS}
                            placeholder="Choose a Lead Source..."
                          />
                        </div>
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Remarks"
                          type="text"
                          name="remarks"
                          onChange={this.onChangeHandler}
                          value={this.state.remarks}
                        />
                      </Col>

                      <Col lg={12}>
                        <h4 className="page-title">Contact Information</h4>
                        <div style={{ margin: "25px 0px 20px 0px" }}>
                          <span
                            style={{
                              display: "block",
                              border: "none",
                              color: "white",
                              height: "1px",
                              background:
                                "-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 350, from(#000), to(#fff))"
                            }}
                          ></span>
                        </div>
                      </Col>

                      <Col lg={4}>
                        <Input
                          label="Email "
                          type="email"
                          name="email"
                          onChange={this.onChangeHandler}
                          value={this.state.email}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Contact No 1 "
                          type="text"
                          name="contact"
                          onChange={this.onChangeHandler}
                          value={this.state.contact}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Contact No 2 "
                          type="text"
                          name="contact2"
                          onChange={this.onChangeHandler}
                          value={this.state.contact2}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Correspondence Address"
                          type="text"
                          name="companyaddress"
                          onChange={this.onChangeHandler}
                          value={this.state.companyaddress}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Office Address "
                          type="text"
                          name="address"
                          onChange={this.onChangeHandler}
                          value={this.state.address}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Company Name"
                          type="text"
                          name="companyname"
                          onChange={this.onChangeHandler}
                          value={this.state.companyname}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Last Purchase "
                          type="date"
                          name="lastpurchasae"
                          onChange={this.onChangeHandler}
                          value={this.state.lastpurchasae}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Last Contact Date "
                          type="date"
                          name="lastcontactdate"
                          onChange={this.onChangeHandler}
                          value={this.state.lastcontactdate}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Next Follow Up Date "
                          type="date"
                          name="nextFollowUpDate"
                          onChange={this.onChangeHandler}
                          value={this.state.nextFollowUpDate}
                        />
                      </Col>
                      <Col lg={12}>
                        <h4 className="page-title">Financial Information</h4>
                        <div style={{ margin: "25px 0px 20px 0px" }}>
                          <span
                            style={{
                              display: "block",
                              border: "none",
                              color: "white",
                              height: "1px",
                              background:
                                "-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 350, from(#000), to(#fff))"
                            }}
                          ></span>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="form-group">
                          <label>Living Expenses</label>
                          <Row>
                            <Col lg={6}>
                              <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                  <div className="input-group-text"><b>S$</b></div>
                                </div>
                                <input
                                  type="text"
                                  name="annualExpense"
                                  value={this.state.annualExpense}
                                  className="form-control"
                                  onChange={this.onChangeHandler}
                                  onBlur={this.onBlurHandler}
                                  placeholder="Yearly"
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                  <div className="input-group-text"><b>S$</b></div>
                                </div>
                                <input
                                  type="text"
                                  name="monthlyExpense"
                                  value={this.state.monthlyExpense}
                                  className="form-control"
                                  onChange={this.onChangeHandler}
                                  onBlur={this.onBlurHandler}
                                  placeholder="Monthly"
                                />
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="form-group">
                          <label>Short Term Savings</label>
                          <Row>
                            <Col lg={6}>
                              <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                  <div className="input-group-text"><b>S$</b></div>
                                </div>
                                <input
                                  type="text"
                                  name="annualShortTermSavings"
                                  value={this.state.annualShortTermSavings}
                                  className="form-control"
                                  onChange={this.onChangeHandler}
                                  onBlur={this.onBlurHandler}
                                  placeholder="Yearly"
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                  <div className="input-group-text"><b>S$</b></div>
                                </div>
                                <input
                                  type="text"
                                  name="monthlyShortTermSavings"
                                  value={this.state.monthlyShortTermSavings}
                                  className="form-control"
                                  onChange={this.onChangeHandler}
                                  onBlur={this.onBlurHandler}
                                  placeholder="Monthly"
                                />
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="form-group">
                          <label>Income</label>
                          <Row>
                            <Col lg={6}>
                              <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                  <div className="input-group-text"><b>S$</b></div>
                                </div>
                                <input
                                  type="text"
                                  name="annualIncome"
                                  value={this.state.annualIncome}
                                  className="form-control"
                                  onChange={this.onChangeHandler}
                                  onBlur={this.onBlurHandler}
                                  placeholder="Yearly"
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                  <div className="input-group-text"><b>S$</b></div>
                                </div>
                                <input
                                  type="text"
                                  name="monthlyIncome"
                                  value={this.state.monthlyIncome}
                                  className="form-control"
                                  onChange={this.onChangeHandler}
                                  onBlur={this.onBlurHandler}
                                  placeholder="Monthly"
                                />
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <UploadCardPicture
                          setFileList={this.setFileList}
                          fileList={this.state.fileList}
                        />
                      </Col>
                      <Col lg={12}>
                        <Button className="float-right" color="primary">Submit</Button>
                      </Col>
                    </Row>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { user, clients, clientAdded, loading, error } = state.User;
  return { user, clients, clientAdded, loading, error };
};

export default connect(mapStateToProps, {
  getUser,
  getClients,
  getClient,
  addClient
})(Add);
