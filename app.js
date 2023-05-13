const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";
const mongoUrl =
	"mongodb+srv://sonalsingh4102:sonalpikachu17@cluster0.ubjjjh5.mongodb.net/?retryWrites=true&w=majority";
mongoose
	.connect(mongoUrl, {
		useNewUrlParser: true,
	})
	.then(() => {
		console.log("Connected to mongoDB");
	})
	.catch((error) => {
		console.log("Error", error);
	});

app.listen(5000, () => {
	console.log("Server is running on port 5000");
});

app.get("/", (req, res) => {
	res.send("Hello, world!");
});

require("./userDetails");

const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
	const { fname, lname, email, password } = req.body;
	const encryptedPassword = await bcrypt.hash(password, 10);

	try {
		const oldUser = await User.findOne({ email: email });
		if (oldUser) {
			return res.send({
				status: "error",
				message: "User already exists",
			});
		}

		await User.create({
			fname: fname,
			lname: lname,
			email: email,
			password: encryptedPassword,
		});
		res.send({ status: "success" });
	} catch (error) {
		res.send({ status: "error" });
	}
});

app.post("/login-user", async (req, res) => {
	const { email, password } = req.body;
    

	const user = await User.findOne({ email });
	if (!user) {
		return res.json({ error: "User Not found" });
	}
	if (await bcrypt.compare(password, user.password)) {
		const token = jwt.sign({}, JWT_SECRET);

		if (res.status(201)) {
			return res.json({ status: "success", data: token });
		} else {
			return res.json({ error: "error" });
		}
	}
	res.json({ status: "error", error: "InvAlid Password" });
});
