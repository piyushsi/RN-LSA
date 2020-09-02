var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: [{ type: String, required: true }],
    points: [{ type: String, required: true }],
    title: {
      type: Schema.Types.ObjectId,
      ref: "Title",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
