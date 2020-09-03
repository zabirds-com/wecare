import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardBody, Button, Alert } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import UploadCardPicture from "../../components/ImageWallEdit";
import { getLoggedInUser } from "../../helpers/authUtils";
import {
  getUser,
  getClients,
  getClient,
  updateClient
} from "../../redux/actions";
import Loader from "../../components/Loader";
import Input from "../../components/Input";
import * as moment from "moment";
import { nationalityOptions, titleOptions, raceOptions, OSoptions } from './options';
import { formatMoney } from "helpers/format";

class EditClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: getLoggedInUser(),
      _id: "",
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
      family: "",
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
      undeleted: [],
      fileList: [],
      focusInput: undefined,
      isDisplayAlert: false,
      isAlertVisible: false,
    };
  }

  setFileList = fileList => {
    this.setState({
      fileList
    });
  };

  deleteFileList = file => {
    this.setState({
      undeleted: this.state.undeleted.filter(item => file !== item)
    });
  };

  componentDidMount() {
    this.props.getClients();
    this.props.getClient(this.props.match.params.id);
    this.props.getUser(this.state.user.id);
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.client).length) {
      const value = nextProps.client;
      let Images = nextProps.client.cards.map((item, key) => {
        return { ...item, uid: key };
      });
      console.log(nextProps.client);
      this.setState({
        _id: value._id,
        title: value.title ? value.title : "", //Typeahead
        nricName: value.nricName,
        preferredName: value.preferredName,
        nric_passport: value.nric_passport,
        dob: value.dob,
        age: parseInt(new Date().getFullYear() - moment.utc(value.dob).year()),
        nextFollowUpDate: value.nextFollowUpDate,
        lastpurchasae: value.lastpurchasae,
        lastcontactdate: value.lastcontactdate,
        hobbies: value.hobbies,
        maritalStatus: value.maritalStatus,
        email: value.email,
        contact: value.contact,
        contact2: value.contact2,
        race: value.race ? value.race : "", //Typeahead
        nationality: value.nationality ? value.nationality : "", //Typeahead
        familyrelationship: value.familyrelationship,
        address: value.address,
        gender: value.gender,
        family: value.family ? value.family : "", //Typeahead
        annualExpense: value.annualExpense,
        monthlyExpense: value.monthlyExpense,
        annualShortTermSavings: value.annualShortTermSavings,
        monthlyShortTermSavings: value.monthlyShortTermSavings,
        annualIncome: value.annualIncome,
        monthlyIncome: value.monthlyIncome,
        companyaddress: value.companyaddress,
        companyname: value.companyname,
        occupation: value.occupation,
        referredsource: value.referredsource ? value.referredsource : "", //Typeahead
        othersource: value.othersource ? value.othersource : "", //Typeahead
        remarks: value.remarks,
        undeleted: Images,
        fileList: Images,
        category: value.category,
      });
    }
  }

  componentDidUpdate() {
    const { updateClientSuccess } = this.props;
    const { isDisplayAlert } = this.state;
    if (updateClientSuccess && !isDisplayAlert) {
      this.setState({ isAlertVisible: true, isDisplayAlert: true }, () => {
        setTimeout(() => {
          this.setState({ isAlertVisible: false });
        }, 3000);
      });
    }
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
        monthlyExpense: parseFloat(
          Math.round((value / 12) * 100) / 100
        ).toFixed(2)
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

  localStringToNumber(s) {
    return Number(String(s).replace(/[^0-9.-]+/g, ""))
  }

  formatCurrency(value) {
    if (!value) {
      return '';
    }

    const { focusInput } = this.state;

    return !focusInput
      ? formatMoney(value) : value;
  }

  onBlurHandler = e => {
    const { value } = e.target;
    e.target.value = value
      ? formatMoney(this.localStringToNumber(value))
      : '';
    this.setState({ focusInput: undefined });
  };

  onFocusHandler = e => {
    var value = e.target.value;
    e.target.value = value ? this.localStringToNumber(value) : ''
    this.setState({ focusInput: e });
  }

  handleFamily = e => {
    this.setState({
      family: e[0] ? { id: e[0].id, label: e[0].label } : null,
    });
  };

  handleRS = e => {
    if (e.length)
      this.setState({
        referredsource: { id: e[0].id, label: e[0].label }
      });
  };

  handleOS = e => {
    if (e.length)
      this.setState({
        othersource: e[0]
      });
  };

  handleTitle = e => {
    if (e.length)
      this.setState({
        title: e[0]
      });
  };

  handleRace = e => {
    if (e.length)
      this.setState({
        race: e[0]
      });
  };

  handleNationality = e => {
    if (e.length)
      this.setState({
        nationality: e[0]
      });
  };

  onSubmitHandler = e => {
    e.preventDefault();

    this.setState({ isDisplayAlert: false });

    const {
      _id,
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
      undeleted,
      fileList
    } = this.state;
    this.props.updateClient(
      _id,
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
      undeleted,
      fileList
    );
  };

  render() {
    const { isAlertVisible } = this.state;

    const options = this.props.clients.map(client => {
      return {
        id: client._id,
        label: client.nricName + " (" + client.preferredName + ")"
      };
    });

    const { family } = this.state;

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
                    <h4 className="page-title">Edit Client</h4>
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
                  <form onSubmit={this.onSubmitHandler} >
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
                            selected={[this.state.title]}
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
                          value={moment
                            .utc(this.state.dob)
                            .format("YYYY-MM-DD")}
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
                          value={this.state.age.toString()}
                        />
                      </Col>
                      <Col lg={4}>
                        <div className="form-group">
                          <label>Gender *</label>
                          <select
                            name="gender"
                            className="form-control"
                            value={this.state.gender}
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
                            selected={[this.state.race]}
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
                            selected={[this.state.nationality]}
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
                          label="Hobbies / Interest "
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
                              value={this.state.category}
                              onChange={this.onChangeHandler}
                              required
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
                            selected={
                              family && family !== ""
                                ? [this.state.family] : []}
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
                          <label>Introduced By</label>
                          <Typeahead
                            selected={this.state.referredsource ? [this.state.referredsource] : []}
                            id="referredsource"
                            multiple={false}
                            options={options}
                            onChange={this.handleRS}
                            placeholder="Choose a Introduced By..."
                          />
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div style={{ marginBottom: "15px" }}>
                          <label>Lead Source</label>
                          <Typeahead
                            selected={[this.state.othersource]}
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
                          type="number"
                          name="contact"
                          onChange={this.onChangeHandler}
                          value={this.state.contact}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Contact No 2 "
                          type="number"
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
                          value={moment
                            .utc(this.state.lastpurchasae)
                            .format("YYYY-MM-DD")}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Last Contact Date "
                          type="date"
                          name="lastcontactdate"
                          onChange={this.onChangeHandler}
                          value={moment
                            .utc(this.state.lastcontactdate)
                            .format("YYYY-MM-DD")}
                        />
                      </Col>
                      <Col lg={4}>
                        <Input
                          label="Next Follow Up Date "
                          type="date"
                          name="nextFollowUpDate"
                          onChange={this.onChangeHandler}
                          value={moment
                            .utc(this.state.nextFollowUpDate)
                            .format("YYYY-MM-DD")}
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
                              <Row>
                                <Col lg={6}>
                                  <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                      <div className="input-group-text"><b>S$</b></div>
                                    </div>
                                    <input
                                      ref={(e) => this.currentInput = e}
                                      type="currency"
                                      name="annualExpense"
                                      value={this.formatCurrency(this.state.annualExpense)}
                                      className="form-control"
                                      onChange={this.onChangeHandler}
                                      onBlur={this.onBlurHandler}
                                      onFocus={this.onFocusHandler}
                                      placeholder="Yearly"
                                    />
                                  </div>
                                </Col>
                                <Col lg={2} style={{ margin: "auto 0", padding: "0", font: "15px" }}><b>annually</b></Col>
                                <Col lg={2}>&nbsp;</Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row>
                                <Col lg={6}>
                                  <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                      <div className="input-group-text"><b>S$</b></div>
                                    </div>
                                    <input
                                      type="currency"
                                      name="monthlyExpense"
                                      value={this.formatCurrency(this.state.monthlyExpense)}
                                      className="form-control"
                                      onChange={this.onChangeHandler}
                                      onBlur={this.onBlurHandler}
                                      onFocus={this.onFocusHandler}
                                      placeholder="Monthly"
                                    />
                                  </div>
                                </Col>
                                <Col lg={2} style={{ margin: "auto 0", padding: "0", font: "15px" }}><b>monthly</b></Col>
                                <Col lg={2}>&nbsp;</Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="form-group">
                          <label>Short Term Savings</label>
                          <Row>
                            <Col lg={6}>
                              <Row>
                                <Col lg={6}>
                                  <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                      <div className="input-group-text"><b>S$</b></div>
                                    </div>
                                    <input
                                      type="currency"
                                      name="annualShortTermSavings"
                                      value={this.formatCurrency(this.state.annualShortTermSavings)}
                                      className="form-control"
                                      onChange={this.onChangeHandler}
                                      onBlur={this.onBlurHandler}
                                      onFocus={this.onFocusHandler}
                                      placeholder="Yearly"
                                    />
                                  </div>
                                </Col>
                                <Col lg={2} style={{ margin: "auto 0", padding: "0", font: "15px" }}><b>annually</b></Col>
                                <Col lg={2}>&nbsp;</Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row>
                                <Col lg={6}>
                                  <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                      <div className="input-group-text"><b>S$</b></div>
                                    </div>
                                    <input
                                      type="currency"
                                      name="monthlyShortTermSavings"
                                      value={this.formatCurrency(this.state.monthlyShortTermSavings)}
                                      className="form-control"
                                      onChange={this.onChangeHandler}
                                      onBlur={this.onBlurHandler}
                                      onFocus={this.onFocusHandler}
                                      placeholder="Monthly"
                                    />
                                  </div>
                                </Col>
                                <Col lg={2} style={{ margin: "auto 0", padding: "0", font: "15px" }}><b>monthly</b></Col>
                                <Col lg={2}>&nbsp;</Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="form-group">
                          <label>Income</label>
                          <Row>
                            <Col lg={6}>
                              <Row>
                                <Col lg={6}>
                                  <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                      <div className="input-group-text"><b>S$</b></div>
                                    </div>
                                    <input
                                      type="currency"
                                      name="annualIncome"
                                      value={this.formatCurrency(this.state.annualIncome)}
                                      className="form-control"
                                      onChange={this.onChangeHandler}
                                      onBlur={this.onBlurHandler}
                                      onFocus={this.onFocusHandler}
                                      placeholder="Yearly"
                                    />
                                  </div>
                                </Col>
                                <Col lg={2} style={{ margin: "auto 0", padding: "0", font: "15px" }}><b>annually</b></Col>
                                <Col lg={2}>&nbsp;</Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row>
                                <Col lg={6}>
                                  <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                      <div className="input-group-text"><b>S$</b></div>
                                    </div>
                                    <input
                                      type="currency"
                                      name="monthlyIncome"
                                      value={this.formatCurrency(this.state.monthlyIncome)}
                                      className="form-control"
                                      onChange={this.onChangeHandler}
                                      onBlur={this.onBlurHandler}
                                      onFocus={this.onFocusHandler}
                                      placeholder="Monthly"
                                    />
                                  </div>
                                </Col>
                                <Col lg={2} style={{ margin: "auto 0", padding: "0", font: "15px" }}><b>monthly</b></Col>
                                <Col lg={2}>&nbsp;</Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <UploadCardPicture
                          setFileList={this.setFileList}
                          fileList={this.state.fileList}
                          deleteFileList={this.deleteFileList}
                        />
                      </Col>
                      <Col lg={12}>
                        <Alert color="success" isOpen={isAlertVisible}>
                          Information has been saved
                        </Alert>
                      </Col>
                      <Col lg={12} >
                        <div className="float-right">
                          <Link to="/clients" style={{ marginRight: "12px" }}>
                            <Button style={{ minWidth: "100px" }} type="reset">Cancel</Button>
                          </Link>
                          <Button color="primary" type="submit">Save Changes</Button>
                        </div>
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
  const {
    clients,
    client,
    user,
    clientAdded,
    updateClientSuccess,
    loading,
    error
  } = state.User;
  return {
    clients,
    client,
    user,
    updateClientSuccess,
    clientAdded,
    loading,
    error
  };
};

export default connect(mapStateToProps, {
  getUser,
  getClients,
  updateClient,
  getClient
})(EditClient);
