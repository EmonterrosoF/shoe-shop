import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const customerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// se ejecuta para verificar la password con la cifrada de la db
customerSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// se ejecuta antes de guardar un cliente para cifrar la password
customerSchema.pre("save", async function (next) {
  // if (!this.isModified("password")) {
  //   next();
  // }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
