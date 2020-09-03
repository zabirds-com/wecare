const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const autopopulate = require("mongoose-autopopulate");


const mainPlanDataSchema = new mongoose.Schema({
  _id: false,
  age: { type: Number, required: true },
  premium: { type: Number, required: true },
  cashOutlay: { type: Number, required: true },
});

const MainPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  riders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rider" }],
  data: { type: [mainPlanDataSchema], default: [] },
}, { timestamps: {} });

MainPlanSchema.plugin(findOrCreate);
MainPlanSchema.plugin(autopopulate);

const MainPlan = mongoose.model("MainPlan", MainPlanSchema);
module.exports = MainPlan;
