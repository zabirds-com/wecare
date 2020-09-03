import React from 'react';
import { connect } from 'react-redux';
import {
  Row, Col, Button, Modal,
  ModalHeader, ModalBody, Label,
} from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import {
  parseISO, differenceInCalendarYears,
} from "date-fns";
import moment from 'moment';
import Input from "../../../../components/Input";
import { addPolicy, getCompanies } from "../../../../redux/actions";
import BenefitModal from './benefitModal';
import {
  PLAN_NEEDS_OPTIONS, POLICY_TYPE_OPTIONS, COMPANY_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS, PAYMENT_OPTIONS, policyTypes, planNeedsTypes
} from '../../policyConfig'

class PolicyModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      policy: {},
      mainPlans: [],
      selectedMainPlan: undefined,
      riders: [],
      selectedRider: undefined,
      showBenefit: false,
    };

    this._benefit = {};
  }

  componentDidMount() {
    const { getCompanies } = this.props;
    getCompanies();
  }

  static getDerivedStateFromProps(props, state) {
    const { policy } = props;
    return { policy };
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

  handlePayment = e => {
    const { policy } = this.state;
    policy.paymentMethod = e[0];
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

  handleSubmit = e => {
    e.preventDefault();
    const { policy, selectedMainPlan, selectedRider } = this.state;
    const { client, addPolicy, toggle } = this.props;

    if (policy.policyType === policyTypes.Hospitalisation) {
      policy.shieldCompany = {
        company: policy.company,
        mainPlan: selectedMainPlan.name,
        rider: selectedRider.name,
      }
    }

    addPolicy(client._id, policy, this._benefit);
    this.setState({ policy: {} });
    toggle();
  };

  closeModal = () => {
    const { toggle } = this.props;
    this._benefit = {};
    this.setState({
      selectedRider: undefined, selectedMainPlan: undefined,
      mainPlans: [], riders: []
    })
    toggle();
  }

  renderFieldsBasedOnPolicyType() {
    const { readOnly } = this.props;
    const { policy } = this.state;
    return (<div style={{ width: "100%" }}>
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
                readOnly={readOnly}
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
                readOnly={readOnly}
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
                readOnly={readOnly}
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
                readOnly={readOnly}
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
                readOnly={readOnly}
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
                readOnly={readOnly}
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
                readOnly={readOnly}
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
                readOnly={readOnly}
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
                readOnly={readOnly}
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
                readOnly={readOnly}
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
                readOnly={readOnly}
              />
            </Col>
          </Row>
        </div>
      </Col>
    </div>);
  }

  render() {
    const { client, companies, show, readOnly } = this.props;
    const { policy, selectedMainPlan, selectedRider, riders, mainPlans, showBenefit } = this.state;
    const { policyType } = policy;
    const shieldCompanyOptions = companies.map(c => ({ id: c._id, label: c.companyname }));
    const mainPlanOptions = mainPlans.map(m => ({ id: m._id, label: m.name }));
    const riderOptions = riders.map(m => ({ id: m._id, label: m.name }));
    const age = client.dob ? differenceInCalendarYears(new Date(), parseISO(client.dob)) : undefined;
    return (
      <>
        <BenefitModal
          benefit={this._benefit}
          show={showBenefit}
          toggle={() => this.setState((prevState) =>
            ({ showBenefit: !prevState.showBenefit }))}
          onCreateBenefit={(benefit) => this._benefit = benefit} />
        <Modal
          size="lg"
          isOpen={show}
          toggle={this.closeModal}
        >
          <ModalHeader>Add Policy</ModalHeader>
          <ModalBody>
            <form onSubmit={this.handleSubmit}>
              <Row>
                <Col lg={12}>
                  <Input
                    label="Policy Name"
                    type="text"
                    name="policyName"
                    onChange={this.updatePolicyField}
                    value={policy.policyName}
                    readOnly={readOnly}
                  />
                </Col>
                <Col lg={6}>
                  <Input
                    label="Policy Number"
                    type="text"
                    name="policyNumber"
                    onChange={this.updatePolicyField}
                    value={policy.policyNumber}
                    readOnly={readOnly}
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
                      disabled={readOnly}
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
                      value={policyType}
                      disabled={readOnly}
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
                        disabled={readOnly}
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
                          disabled={readOnly}
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
                          options={mainPlanOptions}
                          selected={policy.shieldCompany &&
                            policy.shieldCompany.mainPlan ? [policy.shieldCompany.mainPlan] : []}
                          onChange={this.handleMainPlanSelected}
                          placeholder="Choose a main plan...."
                          disabled={readOnly}
                        />
                      </div>
                    </Col>
                    {age && selectedMainPlan ? <>
                      <Col lg={2}>
                        <Input
                          label="Age"
                          type="text"
                          name="age"
                          value={`${age}`}
                          readOnly
                        />
                      </Col>
                      <Col lg={2}>
                        <Input
                          label="Premium"
                          type="text"
                          name="premium"
                          value={selectedMainPlan && selectedMainPlan.data.find(d => +d.age === age) ?
                            selectedMainPlan.data.find(d => +d.age === age).premium : undefined}
                          readOnly
                        />
                      </Col>
                      <Col lg={2}>
                        <Input
                          label="Cash Outlay"
                          type="text"
                          name="cashOutlay"
                          value={selectedMainPlan && selectedMainPlan.data.find(d => d.age === age) ?
                            selectedMainPlan.data.find(d => +d.age === age).cashOutlay : undefined}
                          readOnly
                        />
                      </Col>
                    </>
                      : <Col lg={6} style={{ display: 'flex' }}>
                        <Label style={{ alignSelf: 'center', paddingTop: 20 }}>
                          {selectedMainPlan ? ' Unable to determine the age of client' :
                            readOnly ? '' : 'Please select a main plan'}
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
                          selected={policy.shieldCompany &&
                            policy.shieldCompany.rider ? [policy.shieldCompany.rider] : []}
                          onChange={this.handleRiderSelected}
                          placeholder="Choose a rider...."
                          disabled={readOnly}
                        />
                      </div>
                    </Col>
                    {age && selectedRider ? <>
                      <Col lg={3}>
                        <Input
                          label="Age"
                          type="text"
                          name="age"
                          value={`${age}`}
                          readOnly
                        />
                      </Col>
                      <Col lg={3}>
                        <Input
                          label="Premium"
                          type="text"
                          name="premium"
                          value={selectedRider && selectedRider.data.find(d => +d.age === age) ?
                            selectedRider.data.find(d => +d.age === age).premium : undefined}
                          readOnly
                        />
                      </Col>
                    </>
                      : <Col lg={6} style={{ display: 'flex' }}>
                        <Label style={{ alignSelf: 'center', paddingTop: 20 }}>
                          {selectedRider ? ' Unable to determine the age of client' :
                            readOnly ? '' : 'Please select a rider'}
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
                    readOnly={readOnly}
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
                    readOnly={readOnly}
                  />
                </Col>
                {policyType !== "Hospitalisation" && < Col lg={3}>
                  <Input
                    label="Policy End Age"
                    type="text"
                    name="policyEndAge"
                    onChange={e => {
                      this.onChangeDecimalHandler(e);
                    }}
                    value={policy.policyEndAge}
                    onBlur={e => this.calcPolicyDuration()}
                    readOnly={readOnly}
                  />
                </Col>}
                <Col lg={policyType !== "Hospitalisation" ? 3 : 6}>
                  <Input
                    label="Policy Duration"
                    type="text"
                    name="policyDuration"
                    onChange={this.updatePolicyField}
                    value={policy.policyDuration}
                    readOnly={readOnly}
                  />
                </Col>
                <Col lg={6}>
                  <Input
                    label="Premium (SGD)"
                    type="text"
                    name="premiumSGD"
                    onChange={this.updatePolicyField}
                    value={policy.premiumSGD}
                    readOnly={readOnly}
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
                      disabled={readOnly}
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
                      id="paymentMethod"
                      multiple={false}
                      options={PAYMENT_OPTIONS}
                      selected={policy.paymentMethod ? [policy.paymentMethod] : []}
                      onChange={this.handlePayment}
                      placeholder="Choose a Payment Method...."
                      disabled={readOnly}
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
                      readOnly={readOnly}
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
                          readOnly={readOnly}
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
                          readOnly={readOnly}
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>}
                {
                  this.renderFieldsBasedOnPolicyType()
                }
                <Col lg={12}>
                  <Input
                    label="Remarks"
                    type="text"
                    name="remarks"
                    onChange={this.updatePolicyField}
                    value={policy.remarks}
                    readOnly={readOnly}
                  />
                </Col>
                {!readOnly && <>
                  <Col lg={12} className="text-right">
                    <Button
                      color="success"
                      onClick={() => this.setState((prevState) =>
                        ({ showBenefit: !prevState.showBenefit }))}
                    >Add Benefit</Button>
                  </Col>
                  <Col lg={12}>
                    <Button color="primary">Submit</Button>
                    <Button
                      color="secondary"
                      className="ml-1"
                      onClick={this.closeModal}
                    >Cancel</Button>
                  </Col>
                </>}
              </Row>
            </form>
          </ModalBody>
        </Modal>
      </>
    )
  }
}

const mapStateToProps = state => {
  const { companies } = state.Company;
  return { companies };
};

export default connect(
  mapStateToProps, { getCompanies, addPolicy }
)(PolicyModal);
