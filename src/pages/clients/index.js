import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Alert } from "reactstrap";
import { Modal } from "antd";
import CSVReader from 'react-csv-reader'
import { getLoggedInUser } from "../../helpers/authUtils";
import templatecsv from "../../assets/images/csv/template.csv";
import {
  getUser,
  getClients,
  getClientsByCategory,
  deleteClient,
  addClient
} from "../../redux/actions";
import Loader from "../../components/Loader";
import { Table, Divider, Button, Input, Checkbox, Select } from "antd";
import { filterClientsBySearchText } from "./filterClientHelper";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ClientBriefDocument } from "../../components/ClientBriefDocument";
import { CSVLink } from "react-csv";
import * as moment from "moment";
import { Cookies } from "react-cookie";
import { formatBlankAsDash } from "helpers/format";
const { Search } = Input;

const { Option } = Select;
const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header =>
    header
      .toLowerCase()
      .replace(/\W/g, '_')
}

class Clients extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.columns = [
      {
        title: () => (
          <span>
            <Checkbox onChange={this.onHandleSelectAll} />
          </span>
        ),
        key: "checked",
        render: (value, record) => (
          <span>
            <Checkbox
              onChange={() => {
                this.onHandleSelect(value);
              }}
              checked={value.checked}
            />
          </span>
        )
      },
      {
        title: "Name",
        dataIndex: "nricName",
        key: "name",
        render: (value, record) => formatBlankAsDash(value),
        sorter: (a, b) => a.nricName.localeCompare(b.nricName)
      },
      {
        title: "Contact",
        dataIndex: "contact",
        key: "contact",
        render: value => formatBlankAsDash(value),
      },
      {
        title: "Birth Date",
        dataIndex: "dob",
        key: "dob",
        sorter: (a, b, sortOrder) => {
          if (sortOrder === "ascend" && !a.dob) return 1;
          else if (sortOrder === "ascend" && !b.dob) return -1;
          return new Date(a.dob) - new Date(b.dob);
        },
        render: value => {
          if (value) {
            return moment.utc(value).format("DD-MMM-YYYY");
          }
          return formatBlankAsDash('');
        }
      },
      {
        title: "Family of",
        dataIndex: "family",
        key: "family",
        render: value => {
          return formatBlankAsDash(this.getfamily(value));
        }
      },
      {
        title: "Next Follow Up Date",
        key: "tags",
        dataIndex: "nextFollowUpDate",
        sorter: (a, b, sortOrder) => {
          if (sortOrder === "ascend" && !a.nextFollowUpDate) return 1;
          else if (sortOrder === "ascend" && !b.nextFollowUpDate) return -1;
          return new Date(a.nextFollowUpDate) - new Date(b.nextFollowUpDate);
        },
        render: value => {
          if (value) {
            return moment.utc(value).format("DD-MM-YYYY");
          }
          return formatBlankAsDash('');
        }
      },
      {
        title: "Action",
        key: "action",
        render: (value, record) => (
          <span>
            <Link to={`/clients/${record._id}/view`}>View</Link>
            <Divider type="vertical" />
            <Link to={`/clients/${record._id}/Edit`}>Edit</Link>
            <Divider type="vertical" />
            <span
              onClick={e => {
                this.setState({
                  deleteVisible: true,
                  selectedField: record._id
                });
              }}
            >
              <i className="fa fa-trash" aria-hidden="true"></i>
            </span>
          </span>
        )
      }
    ];
    this.state = {
      user: getLoggedInUser(),
      useradded: false,
      key: "",
      deleteVisible: false,
      printVisible: false,
      selectedField: null,
      csvHeader: [
        { label: "NRIC Name", key: "nricName" },
        { label: "Preferred Name", key: "preferredName" },
        { label: "Date of birth", key: "dob" },
        { label: "E-mail", key: "email" },
        { label: "Contact No", key: "contact" },
        { label: "Contact No 2", key: "contact2" },
        { label: "Gender", key: "gender" },
        { label: "Category", key: "category" },
        { label: "Race", key: "race" },
        { label: "Nationality", key: "nationality" },
        { label: "Occupation", key: "occupation" },
        { label: "Company Name", key: "companyname" },
        { label: "Company Address", key: "companyaddress" },
        { label: "Address", key: "address" },
        { label: "Family", key: "family" },
        { label: "Family Relationship", key: "familyrelationship" },
        { label: "Last Purchase", key: "lastpurchasae" },
        { label: "Next Follow Up Date", key: "nextFollowUpDate" }
      ],
      csvData: [],
      selectedArray: [],
      printArray: [],
      searchText: "",
      printSetting: {
        title: "blank",
        name: "nric",
        suffix: "blank",
        address: "address",
        format: "35"
      }
    };

  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.props.getClients();
    this._isMounted && this.props.getUser(this.state.user.id);
    var that = this;

    setTimeout(() => {
      let elem = document.getElementsByClassName("alert");
      let cookies = new Cookies();
      let cadded = cookies.get("clientadded");
      if (cadded) {
        cookies.remove("clientadded");

        if (elem.length > 0) {

          elem[0].classList.add("alert-absolute-zindex");

          setTimeout(() => {
            elem[0].classList.remove("alert-absolute-zindex");
          }, 5000);

        }

        that.state.useradded = true;
      } else {

        if (elem.length > 0) {
          elem[0].classList.remove("alert-absolute-zindex");
        }
        that.state.useradded = false;
      }
    }, 2000);

  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.clients !== this.props.clients) {
      var clients = nextProps.clients;
      this.setState({ csvData: clients });
    }
    if (nextProps.clients !== this.props.clients) {
      const clients = nextProps.clients;
      clients.forEach(client => {
        client["checked"] = false;
      })
      let filteredClients = filterClientsBySearchText(clients, this.state.searchText);
      this.setState({ selectedArray: filteredClients });
    }
  }

  handleChange(value) {
    this.props.getClients("");
    this.setState({ searchText: value });
  }

  getfamily(value) {
    let family = value
    if (value) {
      family = value.label;
    }
    return family ? family.replace(/\(.*\)/g, "").trim() : undefined;
  }

  handleDeleteCancel = () => {
    this.setState({ deleteVisible: false, selectedField: null });
  };

  handlePrintCancel = () => {
    this.setState({ printVisible: false });
  };

  handlePrintChange = e => {
    let printSetting = { ...this.state.printSetting };
    const { name, value } = e.target;
    printSetting[name] = value;
    this.setState({ printSetting });
  };

  handleCategoryChange = value => {
    const clone = value.map(v => v === " " ? "" : v);
    this.props.getClientsByCategory(clone);
  };

  onDelete = key => {
    this.props.deleteClient(key);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  onHandleSelect = value => {
    value.checked = !value.checked;
    this.setState({ ...this.state.selectedArray, value });
    if (value.checked) {
      this.state.printArray.push(value);
    } else {
      for (let i = 0; i < this.state.printArray.length; i++) {
        if (this.state.printArray[i]._id === value._id) {
          this.state.printArray.splice(i, 1);
        }
      }
    }
  };

  onHandleSelectAll = e => {
    const clients = this.state.selectedArray;
    let printArray = [];
    for (let i = 0; i < clients.length; i++) {
      clients[i]["checked"] = e.target.checked;
      if (e.target.checked) {
        printArray.push(clients[i]);
      }
    }

    this.setState({ selectedArray: clients, printArray });
  };

  handleCSVImport(dataO, filename) {
    dataO.forEach(data => {
      this.props.addClient(
        data["nric_name"],
        data["nric_name"],
        data["preferred_name"],
        data["nric_passport"],
        data["date_of_birth"],
        data["age"],
        data["next_followup_date"],
        data["last_purchasae"],
        data["last_contact_date"],
        data["hobbies"],
        data["marital_status"],
        data["e_mail"],
        data["contact_no"],
        data["contact_no_2"],
        data["race"],
        data["nationality"],
        data["family_relationship"],
        data["address"],
        data["gender"],
        data["category"],
        data["family"],
        data["annual_expense"],
        data["monthly_expense"],
        data["annual_short_term_savings"],
        data["monthly_short_term_savings"],
        data["annual_income"],
        data["monthly_income"],
        data["company_address"],
        data["company_name"],
        data["occupation"],
        "", "",
        data["remarks"],
        []
      );
    });
    window.location.reload();
  }

  render() {
    const { user } = this.props;
    const categories = [];

    if (user.categories) {
      for (let i = 0; i < user.categories.length; i++) {
        const category = user.categories[i]
        const categoryText = category !== "" ? category : " ";
        categories.push(
          <Option style={{ height: "32px" }} key={categoryText}>{categoryText}</Option>
        );
      }
    }
    return (
      <React.Fragment>
        <div className="">
          {/* preloader */}
          {this.props.loading && <Loader />}
          <Row>
            <Col>
              <div className="page-title-box">
                <Row>
                  <Col lg={2}>
                    <h4 className="page-title">Clients</h4>
                  </Col>
                  <Col lg={10} className="mt-lg-3 text-right">
                    <Search
                      placeholder=""
                      style={{ width: 200, marginRight: 20 }}
                      onSearch={this.handleChange.bind(this)}
                      allowClear
                    ></Search>
                    {this.props.user.categories && (
                      <Select
                        style={{ width: 200, marginRight: 20 }}
                        mode="tags"
                        placeholder="Please select category"
                        onChange={this.handleCategoryChange}
                      >
                        {categories}
                      </Select>
                    )}
                    <Link to="/clients/add" style={{ marginRight: 10 }}>
                      <Button type="primary" ghost>
                        Add Client
                      </Button>
                    </Link>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.setState({ printVisible: true });
                      }}
                      ghost
                    >
                      Label Printing
                    </Button>
                    &nbsp;&nbsp;
                    <CSVLink
                      className="btn btn-success"
                      data={this.state.csvData.map(item => {
                        return {
                          ...item,
                          dob: moment.utc(item.dob).format("DD-MM-YYYY")
                        };
                      })}
                      headers={this.state.csvHeader}
                      filename={"Client Data.csv"}
                    >
                      Export
                    </CSVLink>
                  </Col>
                  <Col lg={{ size: 4, offset: 8 }} className='text-right'>
                    <CSVReader label="Import Clients: "
                      parserOptions={papaparseOptions}
                      onFileLoaded={(data, fileName) => this.handleCSVImport(data, fileName)} />
                    <Link to={templatecsv} target="_blank" style={{ marginLeft: 10 }}>
                      <Button type="primary" download>Template</Button>
                    </Link>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Table
                columns={this.columns}
                rowKey="_id"
                dataSource={this.state.selectedArray}
                style={{ overflow: "auto" }}
                rowClassName={(record, index) => { return !record.category ? "highlighter" : "" }}
              />
            </Col>
          </Row>
        </div>
        <Alert className="alert-absolute" color="success"> Request Completed successfully </Alert>
        <Modal
          visible={this.state.deleteVisible}
          footer={[
            <Button
              type="primary"
              onClick={() => {
                this.handleDeleteCancel();
                this.onDelete(this.state.selectedField);
                this.handleChange(this);
              }}
            >
              Confirm
            </Button>,
            <Button type="primary" onClick={this.handleDeleteCancel.bind(this)}>
              Cancel
            </Button>
          ]}
          onCancel={this.handleDeleteCancel}
          zIndex={1051}
        >
          <p>Are you sure?</p>
        </Modal>
        <Modal
          visible={this.state.printVisible}
          footer={[
            <PDFDownloadLink
              document={
                <ClientBriefDocument
                  data={this.state.printArray}
                  printSetting={this.state.printSetting}
                />
              }
              fileName="FinancialPortfolio.pdf"
            >
              <Button type="primary" style={{ marginRight: "20px" }}>
                Print
              </Button>
            </PDFDownloadLink>,
            <Button type="primary" onClick={this.handlePrintCancel.bind(this)}>
              Cancel
            </Button>
          ]}
          onCancel={this.handlePrintCancel}
          zIndex={1051}
        >
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Title</th>
                <th>
                  <select
                    name="title"
                    onChange={this.handlePrintChange}
                    value={this.state.printSetting.title}
                  >
                    <option value="blank">(Blank)</option>
                    <option value="salution">Salutation</option>
                  </select>
                </th>
              </tr>
              <tr>
                <th>Name</th>
                <th>
                  <select
                    name="name"
                    onChange={this.handlePrintChange}
                    value={this.state.printSetting.name}
                  >
                    <option value="nric">NRIC Name</option>
                    <option value="preferred">Preferred Name</option>
                  </select>
                </th>
              </tr>
              <tr>
                <th>Suffix</th>
                <th>
                  <select
                    name="suffix"
                    onChange={this.handlePrintChange}
                    value={this.state.printSetting.suffix}
                  >
                    <option value="blank">(Blank)</option>
                    <option value="family">
                      Insert "& Family" for all clients
                    </option>
                    <option value="detail">
                      Insert "& Family" for clients with family details
                    </option>
                  </select>
                </th>
              </tr>
              <tr>
                <th>Address</th>
                <th>
                  <select
                    name="address"
                    onChange={this.handlePrintChange}
                    value={this.state.printSetting.address}
                  >
                    <option value="address">Address</option>
                    <option value="company">Company Address</option>
                  </select>
                </th>
              </tr>
              <tr>
                <th>Format</th>
                <th>
                  <select
                    name="format"
                    onChange={this.handlePrintChange}
                    value={this.state.printSetting.format}
                  >
                    <option value="35">70 by 35mm label</option>
                    <option value="25.4">70 by 25.4mm label</option>
                  </select>
                </th>
              </tr>
            </tbody>
          </table>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { user, clients, deleteClientSuccess, loading, error } = state.User;
  return { user, clients, deleteClientSuccess, loading, error };
};

export default connect(mapStateToProps, {
  getUser,
  getClients,
  getClientsByCategory,
  deleteClient,
  addClient
})(Clients);
