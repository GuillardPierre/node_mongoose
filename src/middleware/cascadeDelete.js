import Transaction from "../models/Transaction.js";

const accountCascadeDelete = async (schema) => {
  schema.pre("findOneAndDelete", async function (next) {
    try {

      const account = await this.model.findOne(this.getFilter());

      if (account) {

        await Transaction.deleteMany({ account_id: account._id });
        console.log(
          `Suppression en cascade: ${account._id} et ses transactions`
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  });

  schema.pre("deleteOne", async function (next) {
    try {

      if (this._id) {
        await Transaction.deleteMany({ account_id: this._id });
        console.log(`Suppression en cascade des transactions pour ${this._id}`);
      }
      next();
    } catch (error) {
      next(error);
    }
  });
};

export default accountCascadeDelete;
