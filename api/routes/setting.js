const express = require("express");
const router = express.Router();
const Setting = require("../db/models/Setting");
const Company = require("../db/models/Company");
const authorize = require("../utils/authorize.js");

router.get("/", authorize, (req, res) => {
  Setting.findOne()
    .exec()
    .then(setting => {
      return res.json(setting);
    })
    .catch(err => {
      console.error("setting.js: failed to lookup setting", err);
      return res.status(500).json({
        error: err
      });
    });
});

router.post("/addCompany", authorize, (req, res) => {
  if (req.body.company) {
    let companyname = req.body.company;
    var company = new Company();
    company.companyname = companyname;
    company.save()
      .then(doc => {
        Company.find({}).exec(function (err, result) {
          return res.json(result);
        })
      })
      .catch(err => {
        console.error("Failed to update account: ", err);
        return res.status(500).json({ error: err });
      });
  }
});

router.get("/getCompany", authorize, (req, res) => {
  Company.find({})
    .populate({
      path: 'mainPlans',
      populate: {
        path: 'riders',
      },
    }).exec(function (err, result) {
      return res.json(result);
    })
});

router.get("/getCompany/:id", authorize, (req, res) => {
  Company.findById(req.params.id)
    .populate({
      path: 'mainPlans',
      populate: {
        path: 'riders',
      },
    })
    .exec()
    .then(company => {
      return res.json(company);
    })
    .catch(err => {
      console.error("company.js: failed to lookup user by ID", err);
      return res.status(500).json({
        error: err
      });
    });
});
module.exports = router;
