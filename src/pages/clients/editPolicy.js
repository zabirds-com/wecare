import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import _ from 'lodash';
import moment from 'moment';
import {
  parseISO,
  differenceInCalendarYears,
} from "date-fns";
import { Row, Col, Card, CardBody, Button, Alert, Label } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { getLoggedInUser } from "../../helpers/authUtils";
import { getPolicy, updatePolicy, getCompanies } from "../../redux/actions";
import Loader from "../../components/Loader";
import Input from "../../components/Input";
import {
  PLAN_NEEDS_OPTIONS, POLICY_TYPE_OPTIONS, COMPANY_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS, PAYMENT_OPTIONS, policyTypes, planNeedsTypes
} from './policyConfig'

class EditPolicy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: getLoggedInUser(),
      policy: {
        benefit: {},
      },
      mainPlans: [],
      selectedMainPlan: undefined,
      riders: [],
      selectedRider: undefined,
    };
  }

  componentDidMount() {
    const { getCompanies, getPolicy } = this.props;
    getCompanies();
    getPolicy(this.props.match.params.policyId);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps || !nextProps.policy || _.values(nextProps.policy).length === 0) {
      return;
    }

    const { policy } = nextProps;
    const { companies } = nextProps;

    console.log(nextProps);

    if (!policy.shieldCompany) {
      this.setState({
        policy: nextProps.policy,
        mainPlans: [],
        selectedMainPlan: undefined,
        riders: [],
        selectedRider: undefined,
      })
      return;
    }

    const company = companies.find(c => c.companyname === policy.shieldCompany.company);

    if (!company) {
      this.setState({
        policy: nextProps.policy,
        mainPlans: [],
        selectedMainPlan: undefined,
        riders: [],
        selectedRider: undefined,
      })
      return;
    }

    const mainPlan = company.mainPlans.find(m => m.name === policy.shieldCompany.mainPlan);

    const rider = mainPlan ? mainPlan.riders.find(r => r.name === policy.shieldCompany.rider) : undefined;

    this.setState({
      policy: nextProps.policy,
      mainPlans: company.mainPlans,
      selectedMainPlan: mainPlan,
      riders: mainPlan ? mainPlan.riders : [],
      selectedRider: rider,
    })
  }

  calcPolicyDuration() {
    const { policy } = this.state;
    if (!policy.policyEndAge || !policy.ageIncepted
      || policy.policyEndAge === "" || policy.ageIncepted === "") {
      return;
    }

    let x = parseInt(policy.policyEndAge, "10");
    let y = parseInt(policy.ageIncepted, "10");
    policy.policyDuration = `${x - y} years`
    this.setState({ policy: { ...policy } });
  }

  onChangeDecimalHandler = e => {
    if (e.target.value.search(/\D+/) >= 0) {
      return null;
    }
    const { policy } = this.state;
    const { name, value } = e.target;
    policy[name] = value;
    this.setState({ policy: { ...policy } });
  };

  handleCompany = e => {
    const { policy } = this.state;

    if (typeof e[0] === 'object') {
      policy.company = e[0].label;
      this.setState({ policy: { ...policy } });
      return;
    }

    if (e.length) {
      policy.company = e[0];
      this.setState({ policy: { ...policy } });
    }
  };

  handlePayment = e => {
    const { policy } = this.state;
    policy.paymentMethod = e[0];
    this.setState({ policy: { ...policy } });
  };

  updateBenefitField = e => {
    const { name, value } = e.target;
    const { policy } = this.state;
    policy.benefit[name] = value;
    this.setState({ policy: { ...policy } });
  }

  updatePolicyField = e => {
    const { name, value } = e.target;
    const { policy } = this.state;

    if (name === "policyStartDate") {
      const { client } = this.props;
      let dob = "";
      if (client.dob)
        dob = moment.utc(client.dob).format("YYYY");
      let startdate = moment.utc(value).format("YYYY");
      startdate = startdate - dob;
      policy.ageIncepted = startdate
    }

    if (name === "policyType") {
      this.setState({
        mainPlans: [], riders: [],
        selectedMainPlan: undefined, selectedRider: undefined,
      })
    }

    policy[name] = value;
    this.setState({ policy: { ...policy } });
  };

  updatePolicy(fieldName, value) {
    const { policy } = this.state;
    policy[fieldName] = value;
    this.setState({ policy: { ...policy } })
  }

  handleShieldCompanySelected = (e) => {
    if (!e || e.length === 0) {
      return;
    }
    const { policy } = this.state;
    const company = this.props.companies.find(c => c._id === e[0].id);

    if (!company) {
      return;
    }

    policy.company = company.companyname;
    policy.shieldCompany = { company: policy.company };
    this.setState({
      policy: { ...policy },
      mainPlans: company.mainPlans,
      selectedMainPlan: undefined,
      selectedRider: undefined
    });
  }

  handleMainPlanSelected = (e) => {
    if (!e || e.length === 0) {
      return;
    }

    const { mainPlans, policy } = this.state;
    const mainPlan = mainPlans.find(m => m._id === e[0].id);

    if (!mainPlan) {
      return;
    }

    policy.shieldCompany = { ...policy.shieldCompany, mainPlan: mainPlan.name };
    this.setState({
      policy,
      selectedMainPlan: mainPlan,
      riders: mainPlan.riders,
      selectedRider: undefined
    });
  }

  handleRiderSelected = (e) => {
    if (!e || e.length === 0) {
      return;
    }

    const { client } = this.props;
    const { riders, selectedMainPlan, policy } = this.state;
    const rider = riders.find(m => m._id === e[0].id);

    if (!rider) {
      return;
    }

    const age = client.dob ? differenceInCalendarYears(new Date(), parseISO(client.dob)) : undefined;
    const mainPlanData = age && selectedMainPlan ? selectedMainPlan.data.find(d => +d.age === age) : undefined;
    const riderData = age && rider ? rider.data.find(d => +d.age === age) : undefined;
    policy.premiumSGD = policy.policyType === policyTypes.Hospitalisation && mainPlanData && riderData
      ? mainPlanData.cashOutlay + riderData.premium : policy.premiumSGD;
    policy.shieldCompany = { ...policy.shieldCompany, rider: rider.name };
    this.setState({ selectedRider: rider, policy: { ...policy } });
  }

  submitPolicy = e => {
    e.preventDefault();
    const { updatePolicy } = this.props;
    const { policy } = this.state;
    if (policy.policyType !== policyTypes.Hospitalisation) {
      policy.shieldCompany = {};
    }
    updatePolicy(policy, policy.benefit);
  };

  renderFieldsBasedOnPolicyType() {
    const { policy } = this.state;
    if (policy.planningNeeds === planNeedsTypes.RiskManagement) {
      return (
        <Col lg={12}>
          <div className="form-group">
            <label>Coupon Payout</label>
            <Row>
              <Col lg={3}>
                <input
                  type="number"
                  name="couponPayoutFromAge"
                  value={policy.couponPayoutFromAge}
                  onChange={this.updatePolicyField}
                  placeholder="From Age"
                  className="form-control"
                  onBlur={e => {
                    this.updatePolicy('couponPayoutFromAge',
                      parseFloat(e.target.value, "10").toFixed(0));
                  }}
                />
              </Col>
              <Col lg={3}>
                <input
                  type="number"
                  name="couponPayoutToAge"
                  value={policy.couponPayoutToAge}
                  onChange={this.updatePolicyField}
                  placeholder="To Age"
                  className="form-control"
                  onBlur={e => {
                    this.updatePolicy('couponPayoutToAge',
                      parseFloat(e.target.value, "10").toFixed(0));
                  }}
                />
              </Col>
              <Col lg={6}>
                <input
                  type="number"
                  name="couponPayoutAnnualAmount"
                  className="form-control"
                  value={policy.couponPayoutAnnualAmount}
                  onChange={this.updatePolicyField}
                  onBlur={e => {
                    this.updatePolicy('couponPayoutAnnualAmount',
                      parseFloat(e.target.value, "10").toFixed(2));
                  }}
                  placeholder="Annual Amount"
                />
              </Col>
            </Row>
          </div>
        </Col>
      );
    } else if (
      policy.planningNeeds === planNeedsTypes.WealthAccumulation ||
      policy.planningNeeds === planNeedsTypes.WealthPreservation
    ) {
      return (
        <div style={{ width: "100%" }}>
          <Col lg={12}>
            <div className="form-group">
              <label>Maturity Amount</label>
              <Row>
                <Col lg={6}>
                  <input
                    type="number"
                    name="maturityAmountAge"
                    value={policy.maturityAmountAge}
                    onChange={this.updatePolicyField}
                    placeholder="Age"
                    className="form-control"
                    onBlur={e => {
                      this.updatePolicy('maturityAmountAge',
                        parseFloat(e.target.value, "10").toFixed(0));
                    }}
                  />
                </Col>
                <Col lg={6}>
                  <input
                    type="number"
                    name="maturityAmount"
                    className="form-control"
                    value={policy.maturityAmount}
                    onChange={this.updatePolicyField}
                    onBlur={e => {
                      this.updatePolicy('maturityAmount',
                        parseFloat(e.target.value, "10").toFixed(2));
                    }}
                    placeholder="Amount"
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg={12}>
            <div className="form-group">
              <label>Coupon Payout</label>
              <Row>
                <Col lg={3}>
                  <input
                    type="number"
                    name="couponPayoutFromAge"
                    value={policy.couponPayoutFromAge}
                    onChange={this.updatePolicyField}
                    placeholder="From Age"
                    className="form-control"
                    onBlur={e => {
                      this.updatePolicy('couponPayoutFromAge',
                        parseFloat(e.target.value, "10").toFixed(0));
                    }}
                  />
                </Col>
                <Col lg={3}>
                  <input
                    type="number"
                    name="couponPayoutToAge"
                    value={policy.couponPayoutToAge}
                    onChange={this.updatePolicyField}
                    placeholder="To Age"
                    className="form-control"
                    onBlur={e => {
                      this.updatePolicy('couponPayoutToAge',
                        parseFloat(e.target.value, "10").toFixed(0));
                    }}
                  />
                </Col>
                <Col lg={6}>
                  <input
                    type="number"
                    name="couponPayoutAnnualAmount"
                    className="form-control"
                    value={policy.couponPayoutAnnualAmount}
                    onChange={this.updatePolicyField}
                    onBlur={e => {
                      this.updatePolicy('couponPayoutAnnualAmount',
                        parseFloat(e.target.value, "10").toFixed(2));
                    }}
                    placeholder="Annual Amount"
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg={12}>
            <div className="form-group">
              <label>Investment Value</label>
              <Row>
                <Col lg={6}>
                  <input
                    type="number"
                    name="investmentValueAge1"
                    value={policy.investmentValueAge1}
                    onChange={this.updatePolicyField}
                    placeholder="Age"
                    className="form-control"
                    onBlur={e => {
                      this.updatePolicy('investmentValueAge1',
                        parseFloat(e.target.value, "10").toFixed(0));
                    }}
                  />
                </Col>
                <Col lg={6}>
                  <input
                    type="number"
                    name="investmentValueAmount1"
                    className="form-control"
                    value={policy.investmentValueAmount1}
                    onChange={this.updatePolicyField}
                    onBlur={e => {
                      this.updatePolicy('investmentValueAmount1',
                        parseFloat(e.target.value, "10").toFixed(2));
                    }}
                    placeholder="Amount"
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg={12}>
            <div className="form-group">
              <Row>
                <Col lg={6}>
                  <input
                    type="number"
                    name="investmentValueAge2"
                    value={policy.investmentValueAge2}
                    onChange={this.updatePolicyField}
                    placeholder="Age"
                    className="form-control"
                    onBlur={e => {
                      this.updatePolicy('investmentValueAge2',
                        parseFloat(e.target.value, "10").toFixed(0));
                    }}
                  />
                </Col>
                <Col lg={6}>
                  <input
                    type="number"
                    name="investmentValueAmount2"
                    className="form-control"
                    value={policy.investmentValueAmount2}
                    onChange={this.updatePolicyField}
                    onBlur={e => {
                      this.updatePolicy('investmentValueAmount2',
                        parseFloat(e.target.value, "10").toFixed(2));
                    }}
                    placeholder="Amount"
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg={12}>
            <div className="form-group">
              <Row>
                <Col lg={6}>
                  <input
                    type="number"
                    name="investmentValueAge3"
                    value={policy.investmentValueAge3}
                    onChange={this.updatePolicyField}
                    placeholder="Age"
                    className="form-control"
                    onBlur={e => {
                      this.updatePolicy('investmentValueAge3',
                        parseFloat(e.target.value, "10").toFixed(0));
                    }}
                  />
                </Col>
                <Col lg={6}>
                  <input
                    type="number"
                    name="investmentValueAmount3"
                    className="form-control"
                    value={policy.investmentValueAmount3}
                    onChange={this.updatePolicyField}
                    onBlur={e => {
                      this.updatePolicy('investmentValueAmount3',
                        parseFloat(e.target.value, "10").toFixed(2));
                    }}
                    placeholder="Amount"
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </div>
      );
    }
  }

  render() {
    if (this.props.updatePolicySuccess) {
      return (
        <Redirect to={`/clients/${this.props.match.params.id}/view#i-p`} />
      );
    }

    const { companies, client } = this.props;

    const { policy, mainPlans, riders, selectedMainPlan, selectedRider } = this.state;
    const { policyType } = policy;

    const shieldCompanyOptions = companies.map(c => ({ id: c._id, label: c.companyname }));
    const mainPlanOptions = mainPlans.map(m => ({ id: m._id, label: m.name }));
    const riderOptions = riders.map(m => ({ id: m._id, label: m.name }));
    const age = client.dob ? differenceInCalendarYears(new Date(), parseISO(client.dob)) : undefined;

    return (
      <React.Fragment>
        <div>
          {this.props.loading && <Loader />}
          <Row>
            <Col>
              <div className="page-title-box">
                <Row>
                  <Col lg={7}>
                    <h4 className="page-title">Update Policy</h4>
                  </Col>
                  <Col lg={5} className="mt-lg-3 mt-md-0" />
                </Row>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  {this.props.error && (
                    <Alert color="danger" isOpen={!!this.props.error}>
                      <div>{this.props.error}</div>
                    </Alert>
                  )}
                  <form onSubmit={this.submitPolicy}>
                    <Row>
                      <Col lg={12}>
                        <h4 className="page-title">Policy</h4>
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
                        <Input
                          label="Policy Name"
                          type="text"
                          name="policyName"
                          onChange={this.updatePolicyField}
                          value={policy.policyName}
                        />
                      </Col>
                      <Col lg={6}>
                        <Input
                          label="Policy Number"
                          type="text"
                          name="policyNumber"
                          onChange={this.updatePolicyField}
                          value={policy.policyNumber}
                        />
                      </Col>
                      <Col lg={6}>
                        <div className="form-group">
                          <label>Planning Needs</label>
                          <select
                            name="planningNeeds"
                            className="form-control"
                            onChange={this.updatePolicyField}
                            value={policy.planningNeeds}
                          >
                            {PLAN_NEEDS_OPTIONS.map((p, index) => {
                              return (<option key={index} value={p.value}>{p.name}</option>);
                            })}
                          </select>
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="form-group">
                          <label>Policy Type</label>
                          <select
                            name="policyType"
                            className="form-control"
                            onChange={this.updatePolicyField}
                            value={policy.policyType}
                          >
                            {POLICY_TYPE_OPTIONS.map((p, index) => {
                              return (<option key={index} value={p.value}>{p.name}</option>);
                            })}
                          </select>
                        </div>
                      </Col>
                      {policyType !== "Hospitalisation"
                        ? <Col lg={12}>
                          <div style={{ marginBottom: "15px" }}>
                            <label>Company</label>
                            <Typeahead
                              allowNew
                              id="company"
                              multiple={false}
                              selected={policy.company ? [policy.company] : []}
                              options={COMPANY_OPTIONS}
                              onChange={this.handleCompany}
                              placeholder="Choose a Company...."
                            />
                          </div>
                        </Col>
                        :
                        <>
                          <Col lg={12}>
                            <div style={{ marginBottom: "15px" }}>
                              <label>Shield Company</label>
                              <Typeahead
                                allowNew
                                id="shieldCompany"
                                multiple={false}
                                selected={policy.company ? [policy.company] : []}
                                options={shieldCompanyOptions}
                                onChange={this.handleShieldCompanySelected}
                                placeholder="Choose a Company...."
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div style={{ marginBottom: "15px" }}>
                              <label>Main Plan</label>
                              <Typeahead
                                allowNew
                                id="mainPlan"
                                multiple={false}
                                selected={policy.shieldCompany && policy.shieldCompany.mainPlan
                                  ? [policy.shieldCompany.mainPlan] : []}
                                options={mainPlanOptions}
                                onChange={this.handleMainPlanSelected}
                                placeholder="Choose a main plan...."
                              />
                            </div>
                          </Col>
                          {age ? <>
                            <Col lg={2}>
                              <Input
                                label="Age"
                                type="text"
                                name="age"
                                value={age}
                              />
                            </Col>
                            <Col lg={2}>
                              <Input
                                label="Premium"
                                type="text"
                                name="premium"
                                value={selectedMainPlan && selectedMainPlan.data.find(d => +d.age === age) ?
                                  selectedMainPlan.data.find(d => +d.age === age).premium : undefined}
                              />
                            </Col>
                            <Col lg={2}>
                              <Input
                                label="Cash Outlay"
                                type="text"
                                name="cashOutlay"
                                value={selectedMainPlan && selectedMainPlan.data.find(d => d.age === age) ?
                                  selectedMainPlan.data.find(d => +d.age === age).cashOutlay : undefined}
                              />
                            </Col>
                          </>
                            : <Col lg={6}>
                              <Label>
                                Unable to determine the age of client
                                    </Label>
                            </Col>}
                          <Col lg={6}>
                            <div style={{ marginBottom: "15px" }}>
                              <label>Rider</label>
                              <Typeahead
                                allowNew
                                id="mainPlan"
                                multiple={false}
                                options={riderOptions}
                                selected={policy.shieldCompany && policy.shieldCompany.rider
                                  ? [policy.shieldCompany.rider] : []}
                                onChange={this.handleRiderSelected}
                                placeholder="Choose a rider...."
                              />
                            </div>
                          </Col>
                          {age ? <>
                            <Col lg={3}>
                              <Input
                                label="Age"
                                type="text"
                                name="age"
                                value={age}
                              />
                            </Col>
                            <Col lg={3}>
                              <Input
                                label="Premium"
                                type="text"
                                name="premium"
                                value={selectedRider && selectedRider.data.find(d => +d.age === age) ?
                                  selectedRider.data.find(d => +d.age === age).premium : undefined}
                              />
                            </Col>
                          </>
                            : <Col lg={6}>
                              <Label>
                                Unable to determine the age of client
                                    </Label>
                            </Col>}
                        </>}
                      <Col lg={3}>
                        <Input
                          label="Policy Start Date"
                          type="date"
                          name="policyStartDate"
                          onChange={this.updatePolicyField}
                          value={policy.policyStartDate}
                        />
                      </Col>
                      <Col lg={3}>
                        <Input
                          label="Age Incepted"
                          type="text"
                          name="ageIncepted"
                          onChange={e => {
                            this.onChangeDecimalHandler(e);
                          }}
                          value={policy.ageIncepted}
                          onBlur={e => this.calcPolicyDuration()}
                        />
                      </Col>
                      {policyType !== "Hospitalisation" && <Col lg={3}>
                        <Input
                          label="Policy End Age"
                          type="text"
                          name="policyEndAge"
                          onChange={e => {
                            this.onChangeDecimalHandler(e);
                          }}
                          value={policy.policyEndAge}
                          onBlur={e => this.calcPolicyDuration()}
                        />
                      </Col>}
                      <Col lg={policyType !== "Hospitalisation" ? 3 : 6}>
                        <Input
                          label="Policy Duration"
                          type="text"
                          name="policyDuration"
                          onChange={this.updatePolicyField}
                          value={policy.policyDuration}
                        />
                      </Col>
                      <Col lg={6}>
                        <Input
                          label="Premium (SGD)"
                          type="text"
                          name="premiumSGD"
                          onChange={this.updatePolicyField}
                          value={policy.premiumSGD}
                        />
                      </Col>
                      <Col lg={6}>
                        <div className="form-group">
                          <label>Payment Frequency</label>
                          <select
                            name="paymentFrequency"
                            className="form-control"
                            onChange={this.updatePolicyField}
                            value={policy.paymentFrequency}
                          >
                            {PAYMENT_FREQUENCY_OPTIONS.map((p, index) => {
                              return (<option key={index} value={p.value}>{p.name}</option>);
                            })}
                          </select>
                        </div>
                      </Col>
                      <Col lg={policyType !== "Hospitalisation" ? 6 : 12}>
                        <div style={{ marginBottom: "15px" }}>
                          <label>Payment Method</label>
                          <Typeahead
                            id="company"
                            multiple={false}
                            options={PAYMENT_OPTIONS}
                            onChange={this.handlePayment}
                            selected={policy.paymentMethod ? [policy.paymentMethod] : []}
                            placeholder="Choose a Payment Method...."
                          />
                        </div>
                      </Col>
                      {policyType !== "Hospitalisation"
                        && <Col lg={6}>
                          <Input
                            label="Premium End Age"
                            type="text"
                            name="premiumEndAge"
                            onChange={this.onChangeDecimalHandler}
                            value={policy.premiumEndAge}
                          />
                        </Col>
                      }
                      {policyType !== "Hospitalisation" && <Col lg={12}>
                        <div className="form-group">
                          <label>Cash Value</label>
                          <Row>
                            <Col lg={6}>
                              <input
                                type="number"
                                name="cashValueAge"
                                value={policy.cashValueAge}
                                onChange={this.updatePolicyField}
                                placeholder="Age"
                                className="form-control"
                                onBlur={e => {
                                  this.setState({
                                    cashValueAge: parseFloat(
                                      e.target.value,
                                      "10"
                                    ).toFixed(0)
                                  });
                                }}
                              />
                            </Col>
                            <Col lg={6}>
                              <input
                                type="number"
                                name="cashValueAmount"
                                className="form-control"
                                value={policy.cashValueAmount}
                                onChange={this.updatePolicyField}
                                onBlur={e => {
                                  this.setState({
                                    cashValueAmount: parseFloat(
                                      e.target.value,
                                      "10"
                                    ).toFixed(2)
                                  });
                                }}
                                placeholder="Amount"
                              />
                            </Col>
                          </Row>
                        </div>
                      </Col>}
                      {this.renderFieldsBasedOnPolicyType()}
                      <Col lg={12}>
                        <Input
                          label="Remarks"
                          type="text"
                          name="remarks"
                          onChange={this.updatePolicyField}
                          value={policy.remarks}
                        />
                      </Col>
                      <Col lg={12}>
                        <h4 className="page-title">Benefit</h4>
                        <div style={{ margin: "25px 0px 20px 0px" }}>
                          <span
                            style={{
                              display: "block",
                              border: "none",
                              color: "white",
                              height: "2px",
                              background:
                                "-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 350, from(#000), to(#fff))"
                            }}
                          ></span>
                        </div>
                      </Col>
                      <Col lg={6}>
                        <Input
                          label="Death"
                          type="text"
                          name="death"
                          onChange={this.updateBenefitField}
                          value={policy.benefit.death}
                        />
                      </Col>
                      <Col lg={6}>
                        <Input
                          label="Total Permanent Disability"
                          type="text"
                          name="totalPermanentDisability"
                          onChange={this.updateBenefitField}
                          value={policy.benefit.totalPermanentDisability}
                        />
                      </Col>
                      <Col lg={6}>
                        <Input
                          label="Disability Income"
                          type="text"
                          name="disabilityIncome"
                          onChange={this.updateBenefitField}
                          value={policy.benefit.disabilityIncome}
                        />
                      </Col>
                      <Col lg={6}>
                        <Input
                          label="Critical Illness"
                          type="text"
                          name="criticalIllness"
                          onChange={this.updateBenefitField}
                          value={policy.benefit.criticalIllness}
                        />
                      </Col>
                      <Col lg={6}>
                        <Input
                          label="Early Critical Illness"
                          type="text"
                          name="earlyCriticalIllness"
                          onChange={this.updateBenefitField}
                          value={policy.benefit.earlyCriticalIllness}
                        />
                      </Col>
                      <Col lg={6}>
                        <Input
                          label="Accidental Death"
                          type="text"
                          name="accidentalDeath"
                          onChange={this.updateBenefitField}
                          value={policy.benefit.accidentalDeath}
                        />
                      </Col>
                      <Col lg={6}>
                        <Input
                          label="Accidental Disability"
                          type="text"
                          name="accidentalDisability"
                          onChange={this.updateBenefitField}
                          value={policy.benefit.accidentalDisability}
                        />
                      </Col>
                      <Col lg={6}>
                        <Input
                          label="Accidental Reimbursement"
                          type="text"
                          name="accidentalReimbursement"
                          onChange={this.updateBenefitField}
                          value={policy.benefit.accidentalReimbursement}
                        />
                      </Col>
                      <Col lg={12}>
                        <Input
                          label="Hospitalisation"
                          type="text"
                          name="hospitalization"
                          onChange={this.updateBenefitField}
                          value={policy.benefit.hospitalization}
                        />
                      </Col>
                      <Col lg={12}>
                        <Input
                          label="Hospital Income"
                          type="text"
                          name="hospitalIncome"
                          onChange={this.updateBenefitField}
                          value={policy.benefit.hospitalIncome}
                        />
                      </Col>
                      <Col lg={12}>
                        <Input
                          label="Other"
                          type="text"
                          name="otherBenefit"
                          onChange={this.updateBenefitField}
                          value={policy.benefit.otherBenefit}
                        />
                      </Col>
                      <Col lg={12}>
                        <Button type="submit" color="primary">
                          Submit
                        </Button>
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
  const { client, user, policy, updatePolicySuccess, loading, error } = state.User;
  const { companies } = state.Company;
  return { client, user, policy, updatePolicySuccess, loading, error, companies };
};

export default connect(mapStateToProps, { getPolicy, updatePolicy, getCompanies })(
  EditPolicy
);
