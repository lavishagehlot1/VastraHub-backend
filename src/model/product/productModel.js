import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // slug: {
    //   type: String,

    // },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
      },
    ],
    brand: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "OUT_OF_STOCK"],
      default: "DRAFT",
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);
export default productModel;
