const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const autopopulate = require("mongoose-autopopulate");


const riderDataSchema = new mongoose.Schema({
  _id: false,
  age: { type: Number, required: true },
  premium: { type: Number, required: true },
});

const RiderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mainPlanId: { type: mongoose.Schema.Types.ObjectId, ref: "MainPlan" },
  data: { type: [riderDataSchema], default: [] },
}, { timestamps: {} });

RiderSchema.plugin(findOrCreate);
RiderSchema.plugin(autopopulate);

const Rider = mongoose.model("Rider", RiderSchema);
module.exports = Rider;
