import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connecté");
  } catch (err) {
    console.error("Erreur connexion MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
