const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const autopopulate = require("mongoose-autopopulate");

const CompanySchema = new mongoose.Schema({
  companyname: {
    type: String, index: { unique: true }
  },
  headers: { type: Array },
  mainPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MainPlan' }],
});

CompanySchema.plugin(findOrCreate);
CompanySchema.plugin(autopopulate);

const Company = mongoose.model("Company", CompanySchema);
module.exports = Company;
