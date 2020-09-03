import React from 'react';
import {
  Row, Col, Button, Modal,
  ModalHeader, ModalBody,
} from "reactstrap";
import Input from "../../../../components/Input";

class BenefitModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      benefit: {}
    }
  }

  componentWillReceiveProps() {
    const { benefit } = this.props;
    if (benefit) {
      this.setState({ benefit });
    }
  }

  handleBenefitFieldSelected = (e) => {
    const { benefit } = this.state;
    const { name, value } = e.target;
    benefit[name] = value;
    this.setState({ benefit: { ...benefit } });
  }

  createBenefit = (e) => {
    e.preventDefault();
    const { toggle, onCreateBenefit } = this.props;
    toggle();
    onCreateBenefit(this.state.benefit)
  }

  render() {
    const { benefit } = this.state;
    const { show, toggle } = this.props;

    return (
      <Modal
        isOpen={show}
        toggle={toggle}
      >
        <ModalHeader>Add Benefit</ModalHeader>
        <ModalBody>
          <form
            onSubmit={this.createBenefit}
            className="form-horizontal"
          >
            <Row>
              <Col lg={6}>
                <Input
                  label="Death"
                  type="text"
                  name="death"
                  onChange={this.handleBenefitFieldSelected}
                  value={benefit.death}
                />
              </Col>
              <Col lg={6}>
                <Input
                  label="Total Permanent Disability"
                  type="text"
                  name="totalPermanentDisability"
                  onChange={this.handleBenefitFieldSelected}
                  value={benefit.totalPermanentDisability}
                />
              </Col>
              <Col lg={6}>
                <Input
                  label="Disability Income"
                  type="text"
                  name="disabilityIncome"
                  onChange={this.handleBenefitFieldSelected}
                  value={benefit.disabilityIncome}
                />
              </Col>
              <Col lg={6}>
                <Input
                  label="Critical Illness"
                  type="text"
                  name="criticalIllness"
                  onChange={this.handleBenefitFieldSelected}
                  value={benefit.criticalIllness}
                />
              </Col>
              <Col lg={6}>
                <Input
                  label="Early Critical Illness"
                  type="text"
                  name="earlyCriticalIllness"
                  onChange={this.handleBenefitFieldSelected}
                  value={benefit.earlyCriticalIllness}
                />
              </Col>
              <Col lg={6}>
                <Input
                  label="Accidental Death"
                  type="text"
                  name="accidentalDeath"
                  onChange={this.handleBenefitFieldSelected}
                  value={benefit.accidentalDeath}
                />
              </Col>
              <Col lg={6}>
                <Input
                  label="Accidental Disability"
                  type="text"
                  name="accidentalDisability"
                  onChange={this.handleBenefitFieldSelected}
                  value={benefit.accidentalDisability}
                />
              </Col>
              <Col lg={6}>
                <Input
                  label="Accidental Reimbursement"
                  type="text"
                  name="accidentalReimbursement"
                  onChange={this.handleBenefitFieldSelected}
                  value={benefit.accidentalReimbursement}
                />
              </Col>
              <Col lg={12}>
                <Input
                  label="Hospitalisation"
                  type="text"
                  name="hospitalization"
                  onChange={this.handleBenefitFieldSelected}
                  value={benefit.hospitalization}
                />
              </Col>
              <Col lg={12}>
                <Input
                  label="Hospital Income"
                  type="text"
                  name="hospitalIncome"
                  onChange={this.handleBenefitFieldSelected}
                  value={benefit.hospitalIncome}
                />
              </Col>
              <Col lg={12}>
                <Input
                  label="Other"
                  type="text"
                  name="other"
                  onChange={this.handleBenefitFieldSelected}
                  value={benefit.other}
                />
              </Col>
              <Col lg={12}>
                <Button color="primary">Submit</Button>
                <Button
                  color="secondary"
                  className="ml-1"
                  onClick={toggle}
                >Cancel</Button>
              </Col>
            </Row>
          </form>
        </ModalBody>
      </Modal>);
  }
}

export default BenefitModal;