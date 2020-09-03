const express = require("express");
const router = express.Router();
const Company = require("../db/models/Company");
const MainPlan = require("../db/models/MainPlan");
const Rider = require("../db/models/Rider");
const authorize = require("../utils/authorize.js");

router.put("/", authorize, (req, res) => {
  const companyName = req.body.companyName;
  Company.findByIdAndUpdate(req.body.id, {
    companyname: companyName,
  })
    .then(doc => {
      return res.json(doc);
    })
    .catch(err => {
      console.error("Failed to update account: ", err);
      return res.status(500).json({ error: err });
    });
});

router.delete("/", authorize, async (req, res) => {
  try {
    const company = await Company.findById(req.body.id);

    if (!company) {
      return res.status(400);
    }

    const mainPlans = await MainPlan.find({ _id: { $in: company.mainPlans } });
    const riderIds = mainPlans.reduce((a, v) => [...a, ...v.riders], []);
    const riders = await Rider.find({ _id: { $in: riderIds } });

    await Promise.all(riders.map(rider => rider.remove()));
    await Promise.all(mainPlans.map(mainPlan => mainPlan.remove()));
    await company.remove();
    return res.json();
  } catch (e) {
    return res.status(500);
  }
});

router.post("/mainPlan", authorize, async (req, res) => {
  const { companyId, mainPlanName } = req.body;

  if (!companyId || !mainPlanName) {
    return res.status(400);
  }

  const company = await Company.findById(companyId).exec();

  if (!company) {
    return res.status(404).json({ error: `Cannot find the company with id ${companyId}` })
  }

  const mainPlan = await MainPlan.create({ name: mainPlanName });

  if (!mainPlan) {
    return res.status(500);
  }
  company.mainPlans = [...company.mainPlans, mainPlan._id];
  await company.save();
  return res.json(mainPlan);
});

router.put("/mainPlan", authorize, async (req, res) => {
  const { mainPlanId, mainPlan } = req.body;

  if (!mainPlanId || !mainPlan) {
    return res.status(400);
  }
  try {
    const updatedMainPlan = await MainPlan.findByIdAndUpdate(mainPlanId, mainPlan);

    if (!updatedMainPlan) {
      return res.status(400).json({ error: `Unable to update main plan` })
    }

    return res.json(updatedMainPlan);
  } catch (error) {
    return res.status(500);
  }
});

router.delete("/mainPlan", authorize, async (req, res) => {
  const { companyId, mainPlanId } = req.body;

  if (!mainPlanId) {
    return res.status(400);
  }
  try {
    const deletedMainPlan = await MainPlan.findByIdAndRemove(mainPlanId);

    if (!deletedMainPlan) {
      return res.status(400).json({ error: `MainPlan with id ${mainPlanId} not found` })
    }

    const company = await Company.findById(companyId).exec();
    company.mainPlans = company.mainPlans.filter(m => !m.equals(deletedMainPlan._id));
    await company.save();
    return res.json(deletedMainPlan);
  } catch (error) {
    return res.status(500);
  }
});

router.post("/mainPlan/rider", authorize, async (req, res) => {
  const { mainPlanId, riderName } = req.body;

  if (!mainPlanId || !riderName) {
    return res.status(400);
  }

  const mainPlan = await MainPlan.findById(mainPlanId).exec();

  if (!mainPlan) {
    return res.status(404).json({ error: `Cannot find the main plan with id ${mainPlanId}` })
  }

  const rider = await Rider.create({ name: riderName, mainPlanId });

  if (!rider) {
    return res.status(500);
  }

  mainPlan.riders = [...mainPlan.riders, rider._id];
  await mainPlan.save();
  return res.json(rider);
});

router.put("/mainPlan/rider", authorize, async (req, res) => {
  const { riderId, rider } = req.body;

  if (!riderId || !rider) {
    return res.status(400);
  }
  try {
    const oldRider = await Rider.findById(riderId).exec();

    if (!oldRider) {
      return res.status(400).json({ error: `Unable to update main plan` })
    }

    if (!oldRider.mainPlanId.equals(rider.mainPlanId)) {
      const oldMainPlan = await MainPlan.findById(oldRider.mainPlanId);
      oldMainPlan.riders = oldMainPlan.riders.filter(r => !r.equals(oldRider._id));
      await oldMainPlan.save();
      const newMainPlan = await MainPlan.findById(rider.mainPlanId);
      newMainPlan.riders = [...newMainPlan.riders, riderId];
      await newMainPlan.save();
    }

    oldRider.name = rider.name;
    oldRider.data = rider.data;
    oldRider.mainPlanId = rider.mainPlanId;
    await oldRider.save();
    return res.json(oldRider);
  } catch (error) {
    return res.status(500);
  }
});

router.delete("/mainPlan/rider", authorize, async (req, res) => {
  const { riderId } = req.body;

  if (!riderId) {
    return res.status(400);
  }
  try {
    const deletedRider = await Rider.findByIdAndRemove(riderId);

    if (!deletedRider) {
      return res.status(400).json({ error: `Rider with id ${riderId} not found` })
    }

    const mainPlan = await MainPlan.findById(deletedRider.mainPlanId).exec();

    if (!mainPlan) {
      return res.json(deletedRider);
    }

    mainPlan.riders = mainPlan.riders.filter(r => !r.equals(deletedRider._id));
    await mainPlan.save();
    return res.json(deletedRider);
  } catch (error) {
    return res.status(500);
  }
});

module.exports = router;
