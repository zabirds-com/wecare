import React from 'react';
import { connect } from 'react-redux';
import {
  Row, Col, Card, CardBody, Input,
  Button, Label, FormGroup,
  Modal, ModalHeader, ModalBody,
  ModalFooter,
} from 'reactstrap';
import Papa from 'papaparse';
import { Typeahead } from "react-bootstrap-typeahead";
import {
  addRider, updateRider, deleteRider,
} from '../../../redux/actions';
import styles from './styles';
import { convertCsvToRiderData, convertRiderDataToCsv } from './converter';

class Rider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRider: { _id: undefined, name: '', mainPlanId: '' },
      modalVisible: false,
      riders: [],
    }

    this._inputs = {};
    this._handleMainPlanSelected = this._handleMainPlanSelected.bind(this);
    this._addOrUpdateRider = this._addOrUpdateRider.bind(this);
    this._deleteRider = this._deleteRider.bind(this);
    this._uploadRiderData = this._uploadRiderData.bind(this);
    this._downloadRiderData = this._downloadRiderData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ riders: nextProps.riders })
  }

  _handleMainPlanSelected(values) {
    if (values && values.length > 0) {
      const { selectedRider } = this.state;
      this.setState({
        selectedRider: { ...selectedRider, mainPlanId: values[0].id }
      });
    }
  }

  _addOrUpdateRider() {
    const { addRider, updateRider } = this.props;
    const { selectedRider, riders } = this.state;
    if (selectedRider._id) {
      const rider = riders.find(r => r._id === selectedRider._id);
      rider.name = selectedRider.name;
      rider.mainPlanId = selectedRider.mainPlanId;
      rider.data = selectedRider.data;
      this.setState({ selectedRider: { _id: undefined, name: '', mainPlanId: '' } });
      updateRider(selectedRider._id, selectedRider);
    } else {
      this.setState({ selectedRider: { _id: undefined, name: '', mainPlanId: '' } });
      addRider(selectedRider.mainPlanId, selectedRider.name);
    }
    this.setState({ modalVisible: false });
  }

  async _uploadRiderData(rider, e) {
    const { onError, updateRider, riders } = this.props;
    const csvFile = e.target.files[0];
    e.target.value = "";

    if (!csvFile) {
      return;
    }

    try {
      const result = await this._parseRiderCsv(csvFile);
      const riderData = convertCsvToRiderData(result);
      rider.data = riderData;
      updateRider(rider._id, rider);
      this.setState({ riders: [...riders] });
    } catch (err) {
      onError(err.message);
    }
  }

  _downloadRiderData(rider) {
    const filename = `rider-${rider.name}.csv`;
    const csv = convertRiderDataToCsv(rider.data);
    const encodedUri = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  }

  _deleteRider(rider) {
    const { deleteRider } = this.props;
    deleteRider(rider.mainPlanId, rider._id);
  }

  _parseRiderCsv(csvFile) {
    return new Promise((resolve) => {
      Papa.parse(csvFile, {
        complete: (result) => {
          resolve(result);
        }
      });
    });
  }

  render() {
    const { mainPlans } = this.props;
    const { riders, modalVisible, selectedRider, } = this.state;
    const mainPlanOptions = mainPlans.map(mainPlan => {
      return {
        id: mainPlan._id,
        label: mainPlan.name,
      };
    })
    const selectedMainPlan = mainPlanOptions.find(m => m.id === selectedRider.mainPlanId);

    return (
      <Card>
        <CardBody>
          <FormGroup>
            <Label style={styles.sectionTitle}>Rider</Label>
            <Row style={{ marginBottom: 15, marginTop: 20 }}>
              <Col lg={2}>
                <Button
                  className="btn btn-info"
                  style={{ width: 120 }}
                  onClick={() => this.setState({ modalVisible: true })}
                >Add Rider
              </Button>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>Plan name</th>
                      <th>Rider</th>
                      <th>Action</th>
                    </tr>
                  </tbody>
                  <tbody>
                    {riders && riders.map((rider, i) => (
                      <tr key={i}>
                        <td style={styles.td}>
                          <Label>{mainPlans.find(m => m._id === rider.mainPlanId).name}</Label>
                        </td>
                        <td style={styles.td}>
                          <Label>{rider.name}</Label>
                        </td>
                        <td style={styles.td2} >
                          {rider.edit ? <Button className="btn btn-secondary"
                            style={styles.actionButton}
                            onClick={() => {
                              rider.edit = false;
                              this.setState({ riders: [...riders] })
                              this._updateMainPlan(rider);
                            }} >
                            Confirm
                        </Button> : <Button className="btn btn-primary"
                              style={styles.actionButton}
                              onClick={() => {
                                this.setState({ selectedRider: rider, modalVisible: true })
                              }} >
                              Edit
                        </Button>}
                          {rider.data.length === 0 ?
                            <Button className="btn btn-info"
                              style={styles.actionButton}
                              onClick={() => this._inputs[rider._id].click()} >
                              Upload
                            </Button>
                            :
                            <>
                              <Button className="btn btn-info"
                                style={styles.actionButton}
                                onClick={() => this._downloadRiderData(rider)} >
                                View
                            </Button>
                              <Button className="btn btn-info"
                                style={styles.actionButton}
                                onClick={() => this._inputs[rider._id].click()} >
                                Replace
                            </Button>
                            </>
                          }
                          <Button className="btn btn-danger"
                            style={styles.actionButton}
                            onClick={() => this._deleteRider(rider)} >
                            Delete
                        </Button>
                          <input
                            ref={(el) => { this._inputs[rider._id] = el; }}
                            style={{ display: "none" }}
                            type="file"
                            onChange={(e) => this._uploadRiderData(rider, e)}
                            accept=".csv"
                            multiple
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Col>
            </Row>
          </FormGroup>
        </CardBody>
        <Modal
          isOpen={modalVisible}
          centered={true}
          onCancel={this.handlePrintCancel}
          zIndex={1}
        >
          <ModalHeader>Create new rider</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="riderName">Rider's name:</Label>
              <Input
                value={selectedRider.name}
                type="text"
                name="riderName"
                id="riderName"
                onChange={e => {
                  const { selectedRider } = this.state;
                  this.setState({ selectedRider: { ...selectedRider, name: e.target.value } });
                }}
                placeholder="Rider" />
            </FormGroup>
            <FormGroup>
              <Label for="riderName">Main plan:</Label>
              <Typeahead
                id="mainPlan"
                multiple={false}
                options={mainPlanOptions}
                selected={[selectedMainPlan ? selectedMainPlan.label : '']}
                onChange={this._handleMainPlanSelected}
                placeholder="Choose a main plan..."
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary"
              onClick={() => this.setState({
                modalVisible: false,
                selectedRider: { _id: undefined, name: '', mainPlanId: '' }
              })}>
              Cancel
            </Button>
            <Button color="info"
              onClick={this._addOrUpdateRider}>
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
      </Card>
    );
  }
}

const mapStateToProps = ({ Company }) => {
  const { company, mainPlans, riders } = Company;
  return { company, mainPlans, riders };
};

const mapActionsToProps = {
  addRider,
  updateRider,
  deleteRider,
}

export default connect(mapStateToProps, mapActionsToProps)(Rider);
