import mongoose from "mongoose";

const firstBootSchema = mongoose.Schema(
    {
        firstBoot: {
            type: Boolean,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const FirstBoot = mongoose.model("FirstBoot", firstBootSchema);

export default FirstBoot;
