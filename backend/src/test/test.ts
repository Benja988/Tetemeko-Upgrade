import mongoose from "mongoose";

async function checkNews(): Promise<void> {
  try {
    // Replace with your actual database name
    const dbUri = "mongodb://localhost:27017/tetemeko";
    await mongoose.connect(dbUri);
    console.log("✅ Connected to MongoDB");

    const news = await mongoose.connection.db!.collection("news").findOne({
      _id: new mongoose.Types.ObjectId("685ace818fd71d5e057b5719"),
    });

    console.log("📰 Found News:", news ?? "No news found");

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

checkNews();
