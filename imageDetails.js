const mongoose = require("mongoose");

const ImageDetailsScehma = new mongoose.Schema(
	{
		image: String,
		email: String
	},
	{
		collection: "ImageDetails",
	},
);

mongoose.model("ImageDetails", ImageDetailsScehma);
