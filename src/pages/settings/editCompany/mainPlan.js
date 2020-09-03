import React from 'react';
import { connect } from 'react-redux';
import Papa from 'papaparse';
import {
  Row, Col, Card, CardBody, Input,
  Button, Label, FormGroup,
} from 'reactstrap';
import {
  addMainPlan, updateMainPlan, deleteMainPlan,
} from '../../../redux/actions';
import {
  convertCsvToMainPlanData,
  convertMainPlanDataToCsv
} from './converter';
import styles from './styles';

class MainPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainPlans: [],
      newPlanName: '',
    }
    this._inputs = {};
    this._addMainPlan = this._addMainPlan.bind(this);
    this._deleteMainPlan = this._deleteMainPlan.bind(this);
    this._deleteMainPlan = this._deleteMainPlan.bind(this);
    this._uploadMainPlanData = this._uploadMainPlanData.bind(this);
    this._downloadMainPlanData = this._downloadMainPlanData.bind(this);
    this._parseMainPlanCsv = this._parseMainPlanCsv.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ mainPlans: nextProps.mainPlans });
  }

  _addMainPlan() {
    const { addMainPlan, company } = this.props;
    const { newPlanName } = this.state;
    if (!newPlanName || newPlanName !== '') {
      addMainPlan(company._id, newPlanName);
      this.setState({ newPlanName: '' });
    }
  }

  _updateMainPlan(mainPlan) {
    const { updateMainPlan } = this.props;
    updateMainPlan(mainPlan._id, { name: mainPlan.name, data: mainPlan.data });
    this.setState({ mainPlans: [...this.state.mainPlans] });
  }

  _deleteMainPlan(mainPlanId) {
    const { deleteMainPlan, company } = this.props;
    deleteMainPlan(company._id, mainPlanId);
  }

  async _uploadMainPlanData(mainPlan, e) {
    const { onError } = this.props;
    const csvFile = e.target.files[0];
    e.target.value = "";

    if (!csvFile) {
      return;
    }
    try {
      const result = await this._parseMainPlanCsv(csvFile);
      const mainPlanData = convertCsvToMainPlanData(result);
      mainPlan.data = mainPlanData;
      this._updateMainPlan(mainPlan);
    } catch (err) {
      console.log(err);
      onError(err.message);
    }
  }

  _downloadMainPlanData(mainPlan) {
    const filename = `main-plan-${mainPlan.name}.csv`;
    const csv = convertMainPlanDataToCsv(mainPlan.data);
    const encodedUri = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  }

  _parseMainPlanCsv(csvFile) {
    return new Promise((resolve) => {
      Papa.parse(csvFile, {
        complete: (result) => {
          resolve(result);
        }
      });
    });
  }

  render() {
    const { mainPlans, newPlanName } = this.state;

    return (
      <Card>
        <CardBody>
          <FormGroup>
            <Label style={styles.sectionTitle}>Main Plan</Label>
            <Row style={{ marginBottom: 15, marginTop: 20 }}>
              <Col lg={2}>
                <Input
                  type="text"
                  editable="true"
                  onChange={e => this.setState({ newPlanName: e.target.value })
                  }
                  value={newPlanName}
                ></Input>
              </Col>
              <Col lg={2}>
                <Button
                  className="btn btn-info"
                  style={{ width: 90 }}
                  onClick={this._addMainPlan}
                >Add</Button>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>Plan name</th>
                      <th>Action</th>
                    </tr>
                  </tbody>
                  <tbody>
                    {mainPlans && mainPlans.map((mainPlan, i) => {
                      return (
                        <tr key={i}>
                          <td style={styles.td}>
                            {mainPlan.edit ? <Input
                              type="text"
                              onChange={e => {
                                mainPlan.name = e.target.value;
                                this.setState({ mainPlans: [...mainPlans] });
                              }}
                              value={mainPlan.name}
                            /> : <Label>{mainPlan.name}</Label>}
                          </td>
                          <td style={styles.td2} >
                            {mainPlan.edit
                              ? <Button className="btn btn-secondary"
                                style={styles.actionButton}
                                onClick={() => {
                                  mainPlan.edit = false;
                                  this.setState({ mainPlans: [...mainPlans] })
                                  this._updateMainPlan(mainPlan);
                                }}>Confirm</Button>
                              : <Button className="btn btn-primary"
                                style={styles.actionButton}
                                onClick={() => {
                                  mainPlan.edit = true;
                                  this.setState({ mainPlans: [...mainPlans] })
                                }}>Rename</Button>}
                            {mainPlan.data && mainPlan.data.length === 0 ?
                              <Button className="btn btn-info"
                                style={styles.actionButton}
                                onClick={() => this._inputs[mainPlan._id].click()}
                              >Upload</Button>
                              :
                              <>
                                <Button className="btn btn-info"
                                  style={styles.actionButton}
                                  onClick={() => this._downloadMainPlanData(mainPlan)}
                                >View</Button>
                                <Button className="btn btn-info"
                                  style={styles.actionButton}
                                  onClick={() => this._inputs[mainPlan._id].click()}
                                >Replace</Button>
                              </>
                            }
                            <Button className="btn btn-danger"
                              style={styles.actionButton}
                              onClick={() => this._deleteMainPlan(mainPlan._id)}
                            >Delete</Button>
                            <input
                              ref={(el) => { this._inputs[mainPlan._id] = el; }}
                              style={{ display: "none" }}
                              type="file"
                              onChange={(e) => {
                                this._uploadMainPlanData(mainPlan, e);
                              }}
                              accept=".csv"
                              multiple
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </Col>
            </Row>
          </FormGroup>
        </CardBody>
      </Card>
    );
  }
}
const mapStateToProps = ({ Company }) => {
  const { company, mainPlans, } = Company;
  return { company, mainPlans };
};

const mapActionsToProps = {
  addMainPlan,
  updateMainPlan,
  deleteMainPlan,
}

export default connect(mapStateToProps, mapActionsToProps)(MainPlan);
