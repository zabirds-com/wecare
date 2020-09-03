import React from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { parseISO, } from "date-fns";
import format from 'date-fns/format';
import { deletePolicy } from "redux/actions";
import { formatMoney } from 'helpers/format';
import { convertFrequencyToNumber } from 'helpers/dateUtils';

class PolicyTab extends React.Component {

  _showDashIfEmpty(value) {
    return value && value !== '' ? value : '-';
  }

  _calculateAnuallisedPremium(policy) {
    if (!policy.premiumSGD || policy.premiumSGD <= 0) {
      return '-';
    }

    const paymentFrequency = convertFrequencyToNumber(policy.paymentFrequency);
    return `$${formatMoney(policy.premiumSGD * paymentFrequency)}`;
  }

  render() {
    const { client, onViewPolicy, deletePolicy } = this.props;
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Plan Name</th>
            <th>Policy No.</th>
            <th>Policy Start Date</th>
            <th>Annualised Premium</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {client && client.policies &&
            client.policies.map((policy, i) => (
              <tr key={i}>
                <td>{this._showDashIfEmpty(policy.company)}</td>
                <td>{this._showDashIfEmpty(policy.policyName)}</td>
                <td>{this._showDashIfEmpty(policy.policyNumber)}</td>
                <td>{
                  parseISO(policy.policyStartDate).toString() === 'Invalid Date' ? '-'
                    : format(parseISO(policy.policyStartDate), "dd/MM/yyyy")
                }</td>
                <td>
                  {this._calculateAnuallisedPremium(policy)}
                </td>
                <td style={{ "width": '100px' }}>
                  <Link
                    to={`/clients/${client._id}/policy/${policy._id}/update`}
                    className=""
                    onClick={this.setPolicyBox} title="Edit"
                  >
                    <i className="mdi mdi-table-edit iconsize"></i>
                  </Link>
                  <i className="mdi mdi-open-in-new pointer iconsize ml-1" title="View" onClick={() => onViewPolicy(policy)}></i>
                  <i className="mdi mdi-delete pointer text-danger iconsize ml-1" title="Delete" onClick={() => deletePolicy(policy._id)}></i>
                </td>
              </tr>
            ))}
        </tbody>
      </table>)
  }
}


const mapStateToProps = state => {
  const { companies } = state.Company;
  return { companies };
};

export default connect(
  mapStateToProps, { deletePolicy }
)(PolicyTab);
