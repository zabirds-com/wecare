import React, { Component } from "react";
import { connect } from "react-redux";
import memoize from "memoize-one";
import _ from "lodash";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  Row, Col, Card, CardBody, Alert, Button,
  Nav, NavItem, NavLink, TabContent, TabPane,
} from "reactstrap";
import classnames from 'classnames';
import {
  parseISO,
  differenceInCalendarYears,
} from "date-fns";
import { getLoggedInUser } from "../../../helpers/authUtils";
import {
  getClient, getUser,
  deletePolicy, resetPoliciesChanged
} from "../../../redux/actions";
import Loader from "../../../components/Loader";
import PicturesWall from "../../../components/ImageWall";
import { MemoizedPdfDocument } from "../../../components/PdfDocument";
import Charts from '../../../components/Charts';
import PolicyTab from './policy/policyTab';
import PolicyModal from './policy/policyModal';
import ClientInfoTab from './clientInfo';
import { getChartData } from './chartUtil';

class ClientView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "c-i",
      user: getLoggedInUser(),
      showPolicyModal: false,
      userFinancial: {
        death: 0,
        tpd: 0,
        critical_illness: 0,
        early_critical_illness: 0,
        disability_income: 0,
        accidental_death: 0,
        accidental_disability: 0,
        accidental_reimbursement: 0,
        currentCategory: '',
        data: props.data
      },
      readyPdf: true,
      policy: {},
      viewPolicy: false,
      chartData: "",
      chartData2: ""
    };
  }

  initalState = () => {
    this.setState({
      user: getLoggedInUser(),
      userFinancial: {
        death: 0,
        tpd: 0,
        critical_illness: 0,
        early_critical_illness: 0,
        disability_income: 0,
        accidental_death: 0,
        accidental_disability: 0,
        accidental_reimbursement: 0,
        currentCategory: '',
        isGettingChartUri: false,
      },
      readyPdf: true,
    });
  };

  setActive = active => {
    this.setState({
      active
    });
  };

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.props.getUser(this.state.user.id);
      this.props.getClient(this.props.match.params.id);
      this.setState({ readyPdf: false });
      setTimeout(() => {
        this.setState({ readyPdf: true });
      }, 10);
    }
  }

  componentDidUpdate(prevProps) {
    const { chartData, chartData2, isGettingChartUri, active } = this.state;

    if (active === 'i-ch' && this._chart1 && chartData === ""
      && this._chart2 && chartData2 === "" && !isGettingChartUri) {
      console.log('getting chart uri');
      this.getChartDataUri(this._chart1, this._chart2);
    }

    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.getClient(this.props.match.params.id);
      this.setState({ readyPdf: false });
      setTimeout(() => {
        this.setState({ readyPdf: true });
      }, 10);
    }

    const { getUser, getClient, resetPoliciesChanged } = this.props;

    if (this.props.policiesChanged) {
      getClient(this.props.match.params.id);
      getUser(this.state.user.id);
      resetPoliciesChanged();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.setState({
        userFinancial: {
          death: nextProps.user.financial.death,
          tpd: nextProps.user.financial.tpd,
          critical_illness: nextProps.user.financial.critical_illness,
          early_critical_illness: nextProps.user.financial.early_critical_illness,
          disability_income: nextProps.user.financial.disability_income,
          accidental_death: nextProps.user.financial.accidental_death,
          accidental_disability: nextProps.user.financial.accidental_disability,
          accidental_reimbursement: nextProps.user.financial.accidental_reimbursement,
          categories: nextProps.user.categories
        }
      });
    }
  }

  tooglePolicy = () => {
    this.setState(prevState => ({
      showPolicyModal: !prevState.showPolicyModal,
      policy: {},
      viewPolicy: false,
    }));
  };

  handleEditPersonalInformation = (e) => {
    e.preventDefault();
    this.props.history.push(`/clients/${this.props.match.params.id}/Edit`);
  }

  openPolicyModalToView = (policy) => {
    this.setState({
      policy,
      showPolicyModal: true,
      viewPolicy: true,
    })
  }

  renderPdfButton = () => {
    const { client } = this.props;
    const { readyPdf, chartData, chartData2, userFinancial } = this.state;
    return readyPdf
      ? (<PDFDownloadLink
        document={<MemoizedPdfDocument data={client} chartImage={chartData}
          chartImage2={chartData2} userFinancial={userFinancial} />}
        fileName="FinancialPortfolio.pdf"
      >
        <button className="btn btn-secondary">&nbsp;&nbsp;&nbsp;Generate PDF&nbsp;&nbsp;&nbsp;</button>
      </PDFDownloadLink>)
      :
      <button className="btn btn-secondary">&nbsp;&nbsp;&nbsp;Generate PDF&nbsp;&nbsp;&nbsp;</button>
  }

  getChartDataMemoize = memoize(
    (dateOfBirth, policies) => getChartData(dateOfBirth, policies)
  );

  getChartDataUri = (chart1, chart2) => {
    this.setState({ isGettingChartUri: true });
    setTimeout(async () => {
      try {
        let uri = await chart1.dataURI();
        const imgUri1 = uri.imgURI && uri.imgURI !== "" && uri.imgURI !== "data:," ? uri.imgURI : "";
        uri = await chart2.dataURI();
        const imgUri2 = uri.imgURI && uri.imgURI !== "" && uri.imgURI !== "data:," ? uri.imgURI : "";
        this.setState({ isGettingChartUri: false, chartData: imgUri1, chartData2: imgUri2 });
      } catch (err) {
        console.log(err);
      }
    }, 3000);
  };

  render() {
    let images = [];
    const { client, history, match } = this.props;
    const { showPolicyModal, policy, viewPolicy, userFinancial } = this.state;
    const { options1, options2 } = this.getChartDataMemoize(client.dob, client.policies);

    if (client && client.policies) {
      images = client.cards.map((item, key) => {
        return { ...item, uid: key };
      });
    }
    return (
      <React.Fragment>
        <div>
          <PolicyModal
            client={client}
            policy={policy}
            show={showPolicyModal}
            readOnly={viewPolicy}
            toggle={this.tooglePolicy}
            onViewPolicy
          />
          {this.props.loading && <Loader />}
          <Row>
            <Col>
              <div className="page-title-box">
                <Row>
                  <Col lg={7}>
                    <h4 className="page-title">Basic Information</h4>
                  </Col>
                  <Col lg={5} className="mt-lg-3 mt-md-0 text-right">
                    {this.renderPdfButton()}
                    &nbsp;
                    <Button color="primary" onClick={this.tooglePolicy}>
                      Add Policy
                    </Button>
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
                        <p>
                          <strong>Name:</strong> {client.nricName} (
                          {client.preferredName})
                        </p>
                        <p>
                          <strong>Age:</strong>{" "}
                          {client.dob ? differenceInCalendarYears(new Date(), parseISO(client.dob)) : ''}
                        </p>
                        <PicturesWall justDisplay={true} fileList={images} />
                        <br />
                        <Nav tabs>
                          <NavItem style={{ width: "32%", marginLeft: "12px", marginRight: "12px" }}>
                            <NavLink
                              className={classnames({ active: this.state.active === 'c-i' })}
                              onClick={() => this.setActive("c-i")}
                              style={{ backgroundColor: "#2CA9F1" }}
                            >
                              <h5 style={{ color: "white", textAlign: "center" }}>CLIENT'S INFORMATION</h5>
                            </NavLink>
                          </NavItem>
                          <NavItem style={{ width: "32%", marginRight: "12px" }}>
                            <NavLink
                              className={classnames({ active: this.state.active === 'i-p' })}
                              onClick={() => this.setActive("i-p")}
                              style={{ backgroundColor: "#2CA9F1" }}
                            >
                              <h5 style={{ color: "white", textAlign: "center" }}>INSURANCE POLICIES</h5>
                            </NavLink>
                          </NavItem>
                          <NavItem style={{ width: "32%" }}>
                            <NavLink
                              className={classnames({ active: this.state.active === 'i-ch' })}
                              onClick={() => this.setActive("i-ch")}
                              style={{ backgroundColor: "#2CA9F1" }}
                            >
                              <h5 style={{ color: "white", textAlign: "center" }}>GRAPH</h5>
                            </NavLink>
                          </NavItem>
                        </Nav>
                        <TabContent style={{ backgroundColor: "#F5FAFB" }} activeTab={this.state.active} >
                          <TabPane tabId="c-i">
                            <ClientInfoTab
                              history={history}
                              match={match}
                              client={client}
                              userFinancial={userFinancial}
                            />
                          </TabPane>
                          <TabPane tabId="i-p">
                            <PolicyTab
                              client={client}
                              onViewPolicy={this.openPolicyModalToView}
                            />
                          </TabPane>
                          <TabPane tabId="i-ch">
                            <Row>
                              <Col lg={12}>
                                {options1 && <Charts
                                  ref={(el) => this._chart1 = el}
                                  series={options1.series}
                                  height={options1.height}
                                  width={options1.width}
                                  options={options1.options}
                                  type={options1.type}
                                />}
                              </Col>
                            </Row>
                            <Row><Col lg={12} style={{ height: "20px" }}>&nbsp;</Col></Row>
                            <Row>
                              <Col lg={12}>
                                {options2 && <Charts
                                  ref={(el) => this._chart2 = el}
                                  series={options2.series}
                                  height={options2.height}
                                  width={options2.width}
                                  options={options2.options}
                                  type={options2.type}
                                />}
                              </Col>
                            </Row>
                          </TabPane>
                        </TabContent>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </React.Fragment >
    );
  }
}

const mapStateToProps = state => {
  const { client, policiesChanged, user, loading, error } = state.User;
  const { companies } = state.Company;
  return { companies, client, policiesChanged, user, loading, error };
};

export default connect(
  mapStateToProps,
  { getClient, getUser, deletePolicy, resetPoliciesChanged }
)(ClientView);
