import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Row, Col, Card, CardBody,
  Alert, Button, Label, Input,
} from 'reactstrap';

import {
  getCompany, updateCompany, setActive,
} from '../../../redux/actions';
import Loader from '../../../components/Loader';
import { AvForm } from "availity-reactstrap-validation";
import MainPlan from './mainPlan';
import Rider from './rider';
import styles from './styles';

class EditCompany extends Component {

  constructor(props) {
    super(props);
    this.state = {
      company: this.props.company,
      error: undefined,
      riderModalVisible: false,
    };
  }

  componentDidMount() {
    this.props.getCompany(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.company !== this.props.company) {
      this.setState({
        company: nextProps.company,
      });
    }

    this.setState({
      error: nextProps.error,
    });
  }

  changeCompanyName = (event) => {
    const company = { ...this.state.company };
    company.companyname = event.target.value;
    this.setState({ company });
  }

  renameCompany = () => {
    console.log('updateCompany');
    const { updateCompany, match: { params: { id } } } = this.props;
    const { company } = this.state;
    updateCompany(company.companyname, id);
  }

  toList = () => {
    this.props.history.push('/settings');
  }

  saveData = () => {
    this.props.updateCompany(this.state.company, this.props.match.params.id);
    this.props.setActive('shield');
    this.props.history.push('/settings');
  }

  render() {
    const { userAdded, loading } = this.props;
    const { company, error } = this.state;

    if (userAdded._id) {
      return <Redirect to='/users' />;
    }
    return (
      <React.Fragment>
        <div className="">
          { /* preloader */}
          {loading && <Loader />}
          <Row>
            <Col>
              <div className="page-title-box">
                <Row>
                  <Col lg={7}>
                    <h4 className="page-title">Edit Company</h4>
                  </Col>
                  <Col lg={5} className="mt-lg-3 mt-md-0">
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  {error && <Alert color="danger" isOpen={!!error}>
                    <div>{error}</div>
                  </Alert>}
                  <AvForm>
                    <Label style={styles.sectionTitle}>Company Name</Label>
                    <Row >
                      <Col lg={11}>
                        <Input
                          type="text"
                          editable="true"
                          onChange={this.changeCompanyName}
                          value={company && company.companyname}
                        />
                      </Col>
                      <Col lg={1} align="center">
                        <Button
                          className="btn btn-info"
                          style={{ width: 120 }}
                          onClick={this.renameCompany}
                        >Rename</Button>
                      </Col>
                    </Row>
                  </AvForm>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <MainPlan
                onError={(error) => {
                  this.setState({ error });
                  setTimeout(() => this.setState({ error: undefined }), 5000);
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Rider
                onError={(error) => {
                  this.setState({ error });
                  setTimeout(() => this.setState({ error: undefined }), 5000);
                }}
              />
            </Col>
          </Row>
        </div>
      </React.Fragment >
    )
  }
}

const mapStateToProps = ({ User, Company }) => {
  const { user, userAdded, loading } = User;
  const { company, error } = Company;
  return { user, userAdded, loading, error, company };
};

const mapActionsToProps = {
  getCompany,
  updateCompany,
  setActive,
}

export default connect(mapStateToProps, mapActionsToProps)(EditCompany);
