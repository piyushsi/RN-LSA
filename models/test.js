var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TestSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", TestSchema);
