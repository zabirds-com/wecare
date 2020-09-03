import React from 'react';
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import {
  Row, Col, Card, CardBody, Button, Label, CardTitle,
} from "reactstrap";
import {
  parseISO,
  differenceInCalendarYears,
} from "date-fns";
import format from 'date-fns/format';
import _ from 'lodash';
import { styles } from './styles';
import { planNeedsTypes } from '../../policyConfig';
import { convertFrequencyToNumber } from 'helpers/dateUtils';

export default class ClientInfoTab extends React.Component {
  constructor(props) {
    super(props);
    this.sumofFinancialSummary = {};
  }

  sumUpPoliciesFingures = () => {
    const { client } = this.props;
    let value = {
      accidentalDeath: 0,
      accidentalDisability: 0,
      accidentalReimbursement: 0,
      criticalIllness: 0,
      death: 0,
      disabilityIncome: 0,
      earlyCriticalIllness: 0,
      hospitalIncome: "",
      hospitalization: "",
      other: "",
      totalPermanentDisability: 0
    };

    client.policies.sort((a, b) => (a.policyStartDate > b.policyStartDate) ? 1 : -1)

    client.policies.forEach(item => {
      let benefit = item.benefit;
      value.accidentalDeath += parseInt(benefit.accidentalDeath, 10)
        ? parseInt(benefit.accidentalDeath, 10)
        : 0;
      value.accidentalDisability += parseInt(benefit.accidentalDisability, 10)
        ? parseInt(benefit.accidentalDisability, 10)
        : 0;
      value.accidentalReimbursement += parseInt(
        benefit.accidentalReimbursement,
        10
      )
        ? parseInt(benefit.accidentalReimbursement, 10)
        : 0;
      value.death += parseInt(benefit.death, 10)
        ? parseInt(benefit.death, 10)
        : 0;
      value.disabilityIncome += parseInt(benefit.disabilityIncome, 10)
        ? parseInt(benefit.disabilityIncome, 10)
        : 0;
      value.earlyCriticalIllness += parseInt(benefit.earlyCriticalIllness, 10)
        ? parseInt(benefit.earlyCriticalIllness, 10)
        : 0;
      value.criticalIllness += parseInt(benefit.criticalIllness, 10)
        ? parseInt(benefit.criticalIllness, 10)
        : 0;

      value.hospitalIncome = benefit.hospitalIncome
        ? benefit.hospitalIncome
        : null;
      value.hospitalization =
        benefit.hospitalization !== "" ? benefit.hospitalization : null;
      value.totalPermanentDisability += parseInt(
        benefit.totalPermanentDisability,
        10
      )
        ? parseInt(benefit.totalPermanentDisability, 10)
        : 0;
    });
    this.sumofFinancialSummary = value;
  };

  calculateIncomeChartData = () => {
    function getPercentage(input, total) {
      return !total || total === 0 ? 0 : Math.round(input / total * 100);
    }

    const { client: { policies, annualIncome, annualExpense, annualShortTermSavings } } = this.props;

    if (!policies) {
      return [];
    }

    const riskManagementPolicies = policies.filter(policy => policy.planningNeeds === planNeedsTypes.RiskManagement);
    const wealthAccumulationPolicies = policies.filter(policy => policy.planningNeeds === planNeedsTypes.WealthAccumulation);
    const wealthPreservationPolicies = policies.filter(policy => policy.planningNeeds === planNeedsTypes.WealthPreservation);
    const riskManagementSum = riskManagementPolicies.reduce((acc, curr) => acc + this.calculateAnnualisedPremium(curr), 0);
    const wealthAccumulationSum = wealthAccumulationPolicies.reduce((acc, curr) => acc + this.calculateAnnualisedPremium(curr), 0);
    const wealthPreservationSum = wealthPreservationPolicies.reduce((acc, curr) => acc + this.calculateAnnualisedPremium(curr), 0);
    const unusedIncome = annualIncome - riskManagementSum - wealthAccumulationSum - wealthPreservationSum
      - (annualExpense || 0) - (annualShortTermSavings || 0);

    console.log(annualIncome, annualExpense, annualShortTermSavings, unusedIncome);

    return [
      {
        color: '#4ddbff',
        title: 'Risk Management',
        value: getPercentage(riskManagementSum, annualIncome),
        origin: riskManagementSum
      },
      {
        color: '#ff4d4d',
        title: 'Wealth Accumulation',
        value: getPercentage(wealthAccumulationSum, annualIncome),
        origin: wealthAccumulationSum
      },
      {
        color: '#33cc33',
        title: 'Wealth Preservation',
        value: getPercentage(wealthPreservationSum, annualIncome),
        origin: wealthPreservationSum
      },
      {
        color: '#9933ff',
        title: 'Living Expenses',
        value: getPercentage(annualExpense, annualIncome),
        origin: annualExpense
      },
      {
        color: '#ffcc00',
        title: 'Short Term Savings',
        value: getPercentage(annualShortTermSavings, annualIncome),
        origin: annualShortTermSavings
      },
      {
        color: '#a6a6a6',
        title: 'Unused Income',
        value: getPercentage(unusedIncome, annualIncome),
        origin: unusedIncome
      }
    ];
  }

  calculateAnnualisedPremium = (policy) => {
    return policy.premiumSGD && policy.premiumSGD > 0
      ? policy.premiumSGD * convertFrequencyToNumber(policy.paymentFrequency) : 0;
  }

  handleEditPersonalInformation = (e) => {
    e.preventDefault();
    this.props.history.push(`/clients/${this.props.match.params.id}/Edit`);
  }

  render() {
    const { client, userFinancial } = this.props;

    let hospitalizationSum = "";
    let hospitalizationIncomeSum = "";

    if (client && client.policies) {
      this.sumUpPoliciesFingures();
      hospitalizationSum = client.policies.map(p => p.benefit.hospitalization).filter(v => v && v !== "").join(" & ");
      hospitalizationIncomeSum = client.policies.map(p => p.benefit.hospitalIncome).filter(v => v && v !== "").join(" & ");
    }

    const chartData = this.calculateIncomeChartData();
    const chartOptions = {
      labels: chartData.map(c => c.title),
      colors: chartData.map(c => c.color),
      type: 'donut',
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return Math.round(val) + "%"
        }
      },
      legend: {
        formatter: (val, opts) => {
          return `    ${val} (${opts.w.globals.series[opts.seriesIndex]}%)`
        },
        fontSize: '18px',
        fontFamily: 'sans - serif',
        fontWeight: 'bold',
        position: 'right',
        markers: {
          width: 18,
          height: 18,
          radius: 0,
        },
      },
      plotOptions: {
        pie: {
          expandOnClick: true,
          donut: {
            labels: {
              show: true,
            }
          },
        }
      }
    };

    return (
      <>
        <Card body outline color="secondary" className="shadow p-3 m-3 bg-white rounded">
          <CardTitle style={{ color: "#2CA9F1" }}>
            <Row>
              <Col lg={11}>
                <Label style={{ fontSize: "20px" }}>PERSONAL INFORMATION</Label>
              </Col>
              <Col lg={1}>
                <Button outline className="float-right" style={{
                  width: "30px",
                  height: "30px",
                  padding: "6px 0px",
                  fontSize: "12px",
                  lineHight: "1.42857",
                  borderRadius: "15px",
                }}
                  onClick={this.handleEditPersonalInformation}>
                  <i className="fas fa-edit"></i>
                </Button>
              </Col>
            </Row>
          </CardTitle>
          <CardBody style={{ paddingTop: "0px" }}>
            <Row>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>FULL NAME IN NRIC</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>PREFERRED NAME</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>TITLE</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>NRIC NO</Label>
              </Col>

              <Col lg={3}>
                <Label style={styles.fieldData}>{client.nricName}</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldData}>{client.preferredName}</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldData}>{client.title}</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldData}>{client.nric_passport}</Label>
              </Col>
            </Row>
            <Row style={{ marginTop: "1rem" }}>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>DATE OF BIRTH</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>AGE</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>GENDER</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>RACE</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldData}> {client.dob &&
                  format(parseISO(client.dob), "dd/MM/yyyy")}</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldData}>{client.dob ? differenceInCalendarYears(new Date(), parseISO(client.dob)) : ''
                }</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldData}>{_.startCase(client.gender)}</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldData}>{client.race}</Label>
              </Col>
            </Row>
            <Row style={{ marginTop: "1rem" }}>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>NATIONALITY</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>OCCUPATION</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>HOBBIES / INTEREST</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>MARITAL STATUS</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldData}>{client.nationality}</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldData}>{client.occupation}</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldData}>{client.hobbies}</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldData}>{client.maritalStatus}</Label>
              </Col>
            </Row>
            <Row style={{ marginTop: "1rem" }}>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>CATEGORY</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>FAMILY OF</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>FAMILY RELATIONSHIP</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldTitle}>INTRODUCED BY</Label>
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldData}>{client.category}</Label>
              </Col>
              <Col lg={3}>
                {client.family && (
                  <Link to={`/clients/${client.family.id}/view`}>{client.family.label}</Link>
                )}
              </Col>
              <Col lg={3}>
                <Label style={styles.fieldData}>{client.familyrelationship}</Label>
              </Col>
              <Col lg={3}>
                {client.referredsource && (
                  <Link to={`/clients/${client.referredsource.id}/view`}>{client.referredsource.label}</Link>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "1rem" }}>
              <Col lg={6}>
                <Label style={styles.fieldTitle}>LEAD SOURCE</Label>
              </Col>
              <Col lg={6}>
                <Label style={styles.fieldTitle}>REMARK</Label>
              </Col>
              <Col lg={6}>
                <Label style={styles.fieldData}>{client.othersource}</Label>
              </Col>
              <Col lg={6}>
                <Label style={styles.fieldData}>{client.remarks}</Label>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Card body outline color="secondary" className="shadow p-3 m-3 bg-white rounded">
          <CardTitle style={{ color: "#2CA9F1" }}>
            <Row>
              <Col lg={12}>
                <Label style={{ fontSize: "20px" }}>CONTACT INFORMATION</Label>
              </Col>
            </Row>
          </CardTitle>
          <CardBody style={{ paddingTop: "0px" }}>
            <Row>
              <Col lg={4}>
                <Label style={styles.fieldTitle}>EMAIL</Label>
              </Col>
              <Col lg={4}>
                <Label style={styles.fieldTitle}>CONTACT NO 1</Label>
              </Col>
              <Col lg={4}>
                <Label style={styles.fieldTitle}>CONTACT NO 2</Label>
              </Col>
              <Col lg={4}>
                <Label style={styles.fieldData}>{client.email}</Label>
              </Col>
              <Col lg={4}>
                <Label style={styles.fieldData}>{client.contact}</Label>
              </Col>
              <Col lg={4}>
                <Label style={styles.fieldData}>{client.contact2}</Label>
              </Col>
            </Row>
            <Row style={{ marginTop: "1rem" }}>
              <Col lg={4}>
                <Label style={styles.fieldTitle}>CORRESPONDENCE ADDRESS</Label>
              </Col>
              <Col lg={4}>
                <Label style={styles.fieldTitle}>OFFICE ADDRESS</Label>
              </Col>
              <Col lg={4}>
                <Label style={styles.fieldTitle}>COMPANY NAME</Label>
              </Col>
              <Col lg={4}>
                <Label style={styles.fieldData}>{client.companyaddress}</Label>
              </Col>
              <Col lg={4}>
                <Label style={styles.fieldData}>{client.companyname}</Label>
              </Col>
              <Col lg={4}>
                <Label style={styles.fieldData}>{client.address}</Label>
              </Col>
            </Row>
            <Row style={{ marginTop: "1rem" }}>
              <Col lg={4}>
                <Label style={styles.fieldTitle}>LAST PURCHASE</Label>
              </Col>
              <Col lg={4}>
                <Label style={styles.fieldTitle}>LAST CONTACT DATE</Label>
              </Col>
              <Col lg={4}>
                <Label style={styles.fieldTitle}>NEXT FOLLOW UP DATE</Label>
              </Col>
              <Col lg={4}>
                <Label style={styles.fieldData}> {client.lastpurchasae &&
                  format(parseISO(client.lastpurchasae), "dd/MM/yyyy")}</Label>
              </Col>
              <Col lg={4}>
                <Label style={styles.fieldData}> {client.lastcontactdate &&
                  format(parseISO(client.lastcontactdate), "dd/MM/yyyy")}</Label>
              </Col>
              <Col lg={4}>
                <Label style={styles.fieldData}> {client.nextFollowUpDate &&
                  format(parseISO(client.nextFollowUpDate), "dd/MM/yyyy")}</Label>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Card body outline color="secondary" className="shadow p-3 m-3 bg-white rounded">
          <CardTitle style={{ color: "#2CA9F1" }}>
            <Row>
              <Col lg={12}>
                <Label style={{ fontSize: "20px" }}>COVERAGE & FINANCIAL SUMMARY</Label>
              </Col>
            </Row>
          </CardTitle>
          <CardBody style={{ paddingTop: "0px" }}>
            <Row>
              <Col lg={12}>
                <Label style={styles.fieldTitle}>ANNUAL INCOME</Label>
              </Col>
              <Col lg={12} className="mb-1">
                <Label style={{ fontSize: "32px", fontWeight: "bold" }}>
                  {`S$ ${Number(parseFloat(client.annualIncome).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                </Label>
              </Col>
            </Row>
            <Row style={{ marginBottom: "1rem" }}>
              <Col lg={4}>
                <Label style={styles.fieldTitle}>INCOME PROTECTION</Label>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.fieldTitle}>BENEFIT</Label>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.fieldTitle}>OPTIMISATION</Label>
              </Col>
              <Col lg={{ size: 1, offset: 1 }} >
                <Label style={styles.fieldTitle}>MET</Label>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col lg={4}>
                <Row>
                  <Col lg={1}>
                    <div style={styles.bullet} />
                  </Col>
                  <Col lg={11}>
                    <Label style={styles.bulletTitle}>DEATH</Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.bulletData}>
                  {`S$${Number(parseFloat(this.sumofFinancialSummary.death).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                </Label>
              </Col>
              <Col lg={3}>
                <Row>
                  {(client.annualIncome * userFinancial.death / 100 - this.sumofFinancialSummary.death) > 0 && (
                    <Col lg={12}>
                      <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "#f7b84b", marginBottom: "0px" }}>
                        {`S$${Number(parseFloat((client.annualIncome * userFinancial.death / 100 - this.sumofFinancialSummary.death))
                          .toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                      </Label>
                      <span className="badge badge-pill badge-warning float-right" style={styles.badge}>Shortfall</span>
                    </Col>
                  )}
                  <Col lg={12}>
                    <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "gray" }}>
                      {userFinancial.death / 100} times of annual Income
                                      </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={{ size: 1, offset: 1 }} >
                {(client.annualIncome * userFinancial.death / 100 - this.sumofFinancialSummary.death) > 0 ?
                  <i style={styles.unCheck} className="fas fa-times fa-2x" /> : <i style={styles.check} className="fas fa-check fa-2x"></i>}
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div style={styles.divider} />
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col lg={4}>
                <Row>
                  <Col lg={1}>
                    <div style={styles.bullet} />
                  </Col>
                  <Col lg={11}>
                    <Label style={styles.bulletTitle}>TPD
                                        </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.bulletData}>
                  {`S$${Number(parseFloat(this.sumofFinancialSummary.totalPermanentDisability)
                    .toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                </Label>
              </Col>
              <Col lg={3}>
                <Row>
                  {(client.annualIncome * userFinancial.tpd / 100 - this.sumofFinancialSummary.totalPermanentDisability) > 0 && (
                    <Col lg={12}>
                      <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "#f7b84b", marginBottom: "0px" }}>
                        {`S$${Number(parseFloat((client.annualIncome * userFinancial.tpd / 100 - this.sumofFinancialSummary.totalPermanentDisability))
                          .toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                      </Label>
                      <span className="badge badge-pill badge-warning float-right" style={styles.badge}>Shortfall</span>
                    </Col>
                  )}
                  <Col lg={12}>
                    <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "gray" }}>
                      {userFinancial.tpd / 100} times of annual Income
                                      </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={{ size: 1, offset: 1 }} >
                {(client.annualIncome * userFinancial.tpd / 100 - this.sumofFinancialSummary.totalPermanentDisability) > 0 ?
                  <i style={styles.unCheck} className="fas fa-times fa-2x" /> : <i style={styles.check} className="fas fa-check fa-2x"></i>}
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div style={styles.divider} />
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col lg={4}>
                <Row>
                  <Col lg={1}>
                    <div style={styles.bullet} />
                  </Col>
                  <Col lg={11}>
                    <Label style={styles.bulletTitle}>CRITICAL ILLNESS
                                        </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.bulletData}>
                  {`S$${Number(parseFloat(this.sumofFinancialSummary.criticalIllness)
                    .toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                </Label>
              </Col>
              <Col lg={3}>
                <Row>
                  {(client.annualIncome * userFinancial.critical_illness / 100 - this.sumofFinancialSummary.criticalIllness) > 0 && (
                    <Col lg={12}>
                      <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "#f7b84b", marginBottom: "0px" }}>
                        {`S$${Number(parseFloat((client.annualIncome * userFinancial.critical_illness / 100 - this.sumofFinancialSummary.criticalIllness))
                          .toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                      </Label>
                      <span className="badge badge-pill badge-warning float-right" style={styles.badge}>Shortfall</span>
                    </Col>
                  )}
                  <Col lg={12}>
                    <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "gray" }}>
                      {userFinancial.critical_illness / 100} times of annual Income
                                      </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={{ size: 1, offset: 1 }} >
                {(client.annualIncome * userFinancial.critical_illness / 100 - this.sumofFinancialSummary.criticalIllness) > 0 ?
                  <i style={styles.unCheck} className="fas fa-times fa-2x" /> : <i style={styles.check} className="fas fa-check fa-2x"></i>}
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div style={styles.divider} />
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col lg={4}>
                <Row>
                  <Col lg={1}>
                    <div style={styles.bullet} />
                  </Col>
                  <Col lg={11}>
                    <Label style={styles.bulletTitle}>EARLY CRITICAL ILLNESS
                                        </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.bulletData}>
                  {`S$${Number(parseFloat(this.sumofFinancialSummary.earlyCriticalIllness)
                    .toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                </Label>
              </Col>
              <Col lg={3}>
                <Row>
                  {(client.annualIncome * userFinancial.early_critical_illness / 100 - this.sumofFinancialSummary.earlyCriticalIllness) > 0 && (
                    <Col lg={12}>
                      <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "#f7b84b", marginBottom: "0px" }}>
                        {`S$${Number(parseFloat((client.annualIncome * userFinancial.early_critical_illness / 100 - this.sumofFinancialSummary.earlyCriticalIllness))
                          .toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                      </Label>
                      <span className="badge badge-pill badge-warning float-right" style={styles.badge}>Shortfall</span>
                    </Col>
                  )}
                  <Col lg={12}>
                    <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "gray" }}>
                      {userFinancial.early_critical_illness / 100} times of annual Income
                                      </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={{ size: 1, offset: 1 }} >
                {(client.annualIncome * userFinancial.early_critical_illness / 100 - this.sumofFinancialSummary.earlyCriticalIllness) > 0 ?
                  <i style={styles.unCheck} className="fas fa-times fa-2x" /> : <i style={styles.check} className="fas fa-check fa-2x"></i>}
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div style={styles.divider} />
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col lg={4}>
                <Row>
                  <Col lg={1}>
                    <div style={styles.bullet} />
                  </Col>
                  <Col lg={11}>
                    <Label style={styles.bulletTitle}>DISABILITY INCOME
                                        </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.bulletData}>
                  {`S$${Number(parseFloat(this.sumofFinancialSummary.disabilityIncome)
                    .toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                </Label>
              </Col>
              <Col lg={3}>
                <Row>
                  {(client.annualIncome * userFinancial.disability_income / 100 - this.sumofFinancialSummary.disabilityIncome) > 0 && (
                    <Col lg={12}>
                      <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "#f7b84b", marginBottom: "0px" }}>
                        {`S$${Number(parseFloat((client.annualIncome * userFinancial.disability_income / 100 - this.sumofFinancialSummary.disabilityIncome))
                          .toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                      </Label>
                      <span className="badge badge-pill badge-warning float-right" style={styles.badge}>Shortfall</span>
                    </Col>
                  )}
                  <Col lg={12}>
                    <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "gray" }}>
                      {userFinancial.disability_income / 100} times of annual Income
                                      </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={{ size: 1, offset: 1 }} >
                {(client.annualIncome * userFinancial.disability_income / 100 - this.sumofFinancialSummary.disabilityIncome) > 0 ?
                  <i style={styles.unCheck} className="fas fa-times fa-2x" /> : <i style={styles.check} className="fas fa-check fa-2x"></i>}
              </Col>
            </Row>
            <Row style={{ marginBottom: "1rem", marginTop: "1rem" }}>
              <Col lg={4}>
                <Label style={styles.fieldTitle}>HEALTH PROTECTION</Label>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.fieldTitle}>BENEFIT</Label>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.fieldTitle}>OPTIMISATION</Label>
              </Col>
              <Col lg={{ size: 1, offset: 1 }} >
                <Label style={styles.fieldTitle}>MET</Label>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col lg={4}>
                <Row>
                  <Col lg={1}>
                    <div style={styles.bullet1} />
                  </Col>
                  <Col lg={11}>
                    <Label style={styles.bulletTitle}>HOSPITALISATION
                                        </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.bulletData2}>
                  {hospitalizationSum}
                </Label>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div style={styles.divider} />
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col lg={4}>
                <Row>
                  <Col lg={1}>
                    <div style={styles.bullet1} />
                  </Col>
                  <Col lg={11}>
                    <Label style={styles.bulletTitle}>HOSPITALISATION INCOME
                                        </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.bulletData2}>
                  {hospitalizationIncomeSum}
                </Label>
              </Col>
            </Row>
            <Row style={{ marginBottom: "1rem", marginTop: "1rem" }}>
              <Col lg={4}>
                <Label style={styles.fieldTitle}>ACCIDENT PROTECTION</Label>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.fieldTitle}>BENEFIT</Label>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.fieldTitle}>OPTIMISATION</Label>
              </Col>
              <Col lg={{ size: 1, offset: 1 }} >
                <Label style={styles.fieldTitle}>MET</Label>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col lg={4}>
                <Row>
                  <Col lg={1}>
                    <div style={styles.bullet2} />
                  </Col>
                  <Col lg={11}>
                    <Label style={styles.bulletTitle}>ACCIDENTAL DEATH
                                        </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.bulletData}>
                  {`S$${Number(parseFloat(this.sumofFinancialSummary.accidentalDeath).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                </Label>
              </Col>
              <Col lg={3}>
                <Row>
                  {(userFinancial.accidental_death - this.sumofFinancialSummary.death) > 0 && (
                    <Col lg={12}>
                      <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "#f7b84b", marginBottom: "0px" }}>
                        {`S$${Number(parseFloat((userFinancial.accidental_death - this.sumofFinancialSummary.accidentalDeath))
                          .toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                      </Label>
                      <span className="badge badge-pill badge-warning float-right" style={styles.badge}>Shortfall</span>
                    </Col>
                  )}
                  <Col lg={12}>
                    <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "gray" }}>
                      {`~ S$${Number(parseFloat(userFinancial.accidental_death).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                    </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={{ size: 1, offset: 1 }} >
                {(userFinancial.accidental_death - this.sumofFinancialSummary.death) > 0 ?
                  <i style={styles.unCheck} className="fas fa-times fa-2x" /> : <i style={styles.check} className="fas fa-check fa-2x"></i>}
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div style={styles.divider} />
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col lg={4}>
                <Row>
                  <Col lg={1}>
                    <div style={styles.bullet2} />
                  </Col>
                  <Col lg={11}>
                    <Label style={styles.bulletTitle}>ACCIDENTAL DISABILITY
                                        </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.bulletData}>
                  {`S$${Number(parseFloat(this.sumofFinancialSummary.accidentalDisability).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                </Label>
              </Col>
              <Col lg={3}>
                <Row>
                  {(userFinancial.accidental_disability - this.sumofFinancialSummary.accidentalDisability) > 0 && (
                    <Col lg={12}>
                      <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "#f7b84b", marginBottom: "0px" }}>
                        {`S$${Number(parseFloat((userFinancial.accidental_disability - this.sumofFinancialSummary.accidentalDisability))
                          .toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                      </Label>
                      <span className="badge badge-pill badge-warning float-right" style={styles.badge}>Shortfall</span>
                    </Col>
                  )}
                  <Col lg={12}>
                    <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "gray" }}>
                      {`~ S$${Number(parseFloat(userFinancial.accidental_disability).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })} per injury`}
                    </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={{ size: 1, offset: 1 }} >
                {(userFinancial.accidental_disability - this.sumofFinancialSummary.accidentalDisability) > 0 ?
                  <i style={styles.unCheck} className="fas fa-times fa-2x" /> : <i style={styles.check} className="fas fa-check fa-2x"></i>}
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div style={styles.divider} />
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col lg={4}>
                <Row>
                  <Col lg={1}>
                    <div style={styles.bullet2} />
                  </Col>
                  <Col lg={11}>
                    <Label style={styles.bulletTitle}>ACCIDENTAL REIMBURSEMENT</Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={3}>
                <Label className="float-right" style={styles.bulletData}>
                  {`S$${Number(parseFloat(this.sumofFinancialSummary.accidentalReimbursement).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                </Label>
              </Col>
              <Col lg={3}>
                <Row>
                  {(userFinancial.accidental_reimbursement - this.sumofFinancialSummary.accidentalReimbursement) > 0 && (
                    <Col lg={12}>
                      <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "#f7b84b", marginBottom: "0px" }}>
                        {`S$${Number(parseFloat((userFinancial.accidental_reimbursement - this.sumofFinancialSummary.accidentalReimbursement))
                          .toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })}`}
                      </Label>
                      <span className="badge badge-pill badge-warning float-right" style={styles.badge}>Shortfall</span>
                    </Col>
                  )}
                  <Col lg={12}>
                    <Label className="float-right" style={{ fontSize: "14px", fontWeight: "bold", color: "gray" }}>
                      {`~ S$${Number(parseFloat(userFinancial.accidental_reimbursement).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 0 })} per injury`}
                    </Label>
                  </Col>
                </Row>
              </Col>
              <Col lg={{ size: 1, offset: 1 }} >
                {(userFinancial.accidental_disability - this.sumofFinancialSummary.accidentalReimbursement) > 0 ?
                  <i style={styles.unCheck} className="fas fa-times fa-2x" /> : <i style={styles.check} className="fas fa-check fa-2x"></i>}
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Card body outline color="secondary" className="shadow p-3 m-3 bg-white rounded">
          <CardTitle style={{ color: "#2CA9F1" }}>
            <Row>
              <Col lg={12}>
                <Label style={{ fontSize: "20px" }}>FINANCIAL PORTFOLIO VS INCOME</Label>
              </Col>
            </Row>
          </CardTitle>
          <CardBody style={{ paddingTop: "0px" }}>
            {chartData[chartData.length - 1] && chartData[chartData.length - 1].origin < 0 ?
              <Row style={{ alignItems: "center" }}>
                <Label style={styles.bulletTitle3}>
                  {`Error: Annualised premium should not be higher than annual income.`}
                </Label>
              </Row>
              :
              <Row style={{ alignItems: "center" }}>
                <Col lg={12} style={{ display: "flex", justifyContent: "center" }}>
                  <Chart
                    options={chartOptions}
                    series={chartData.map(c => c.value)}
                    width="800"
                    type="donut"
                  />
                </Col>
              </Row>}
          </CardBody>
        </Card>
      </>
    )
  }
}