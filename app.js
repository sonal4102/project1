const express = require("express");
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
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
require("./imageDetails");

const User = mongoose.model("UserInfo");
const Images= mongoose.model("ImageDetails");
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
		const token = jwt.sign({email:user.email}, JWT_SECRET);

		if (res.status(201)) {
			return res.json({ status: "success", data: token });
		} else {
			return res.json({ error: "error" });
		}
	}
	res.json({ status: "error", error: "InvAlid Password" });
});


app.post("/userData", async (req, res) => {
    const { token } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET, (err, res) => {
        if (err) {
          return "token expired";
        }
        return res;
      });
      console.log(user);
    //   if (user == "token expired") {
    //     return res.send({ status: "error", data: "token expired" });
    //   }
  
      const useremail = user.email;
      User.findOne({ email: useremail })
        .then((data) => {
          res.send({ status: "success", data: data });
        })
        .catch((error) => {
          res.send({ status: "error", data: error });
        });
    } catch (error) {
      res.send({ status: "error", data: error });
    }
  });


  app.post("/upload-image", async (req, res) => {
    const { base64 ,email} = req.body;
    try {
      await Images.create({ image: base64, email:email });
      res.send({ Status: "success" })
  
    } catch (error) {
      res.send({ Status: "error", data: error });
  
    }
  })



  app.get("/get-image", async (req, res) => {
    const email= req.query.email;
    try {
      await Images.find({}).then(data => {

        const data1 =[]
        data.filter((item) => {
            if (item.email == email) {
                data1.push(item);
            }
        })

        res.send({ status: "success", data: data1 })
      })
  
    } catch (error) {
  
    }
  })