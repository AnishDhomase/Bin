import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.Mongodb_URI).then(() => {
      console.log(`connected to database`);
    });
  } catch (error) {
    console.log(error, `unable to connect to database`);
  }
};
