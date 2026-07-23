import Transaction from "../models/Transaction.js";

const accountCascadeDelete = async (schema) => {
  schema.pre("deleteOne", async function () {
    if (this._id) {
      await Transaction.deleteMany({ account_id: this._id });
    }
  });
};

export default accountCascadeDelete;
