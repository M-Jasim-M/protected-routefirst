// // // server.js

// // const express = require('express');
// // const mongoose = require('mongoose');
// // const bodyParser = require('body-parser');

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // app.use(bodyParser.json());

// // // Connect to MongoDB using Mongoose
// // mongoose.connect('mongodb+srv://jasimwazir098:khan!!!@cluster0.bbx0tzz.mongodb.net/myapp', {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // }).then(()=>{

// // console.log("mongo db connected");

// // });

// // const User = require('./Schema/Schema'); // Assuming you have a User model

// // // Handle form submission
// // app.post('/api/signup', async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
    
// //     // Create a new user instance using the User model
// //     const newUser = new User({
// //       email,
// //       password,
// //     });

// //     // Save the new user to the database
// //     await newUser.save();

// //     res.status(201).json({ message: 'User registered successfully' });
// //   } catch (error) {
// //     res.status(500).json({ error: 'An error occurred' });
// //   }
// // });

// // app.listen(PORT, () => {
// //   console.log(`Server is running on port ${PORT}`);
// // });

// // index.js (or your main server file)

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors()); 
// app.use(bodyParser.json());

// // Connect to MongoDB using Mongoose
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log("MongoDB connected");
// });

// const User = require('./Schema/Schema'); // Assuming you have a User model

// // Handle form submission
// app.post('/api/signup', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'in database' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

    
//     // Create a new user instance using the User model
//     const newUser = new User({
//       email,
//       password: hashedPassword,
//     });

//     // Save the new user to the database
//     await newUser.save();
//     console.log('User saved successfully to MongoDB');
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });


// app.post('/api/signin', async (req, res) => {
//     const { email, password } = req.body;
//     try {

//       // Find the user by email
//       const user = await User.findOne({ email });
  
//       // If user doesn't exist, return an error
//       if (!user) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }
  
//       // Compare the provided password with the hashed password in the database
//       const isPasswordValid = await bcrypt.compare(password, user.password);
  
//       if (!isPasswordValid) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }
  
//       // User is authenticated
//       res.status(200).json({ message: 'User authenticated successfully' });
//       console.log("user authenticated successfully");
//     } catch (error) {
//       res.status(500).json({ error: 'An error occurred' });
//     }
//   });




// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();
const path = require('path')
const app = express();
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
});

const User = require('./Schema/Schema'); // Assuming you have a User model

app.post('/api/signup', async (req, res) => {
  try {
    
    const { email, password } = req.body;
    console.log(email)

    const existingUser = await User.findOne({email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log('User saved successfully to MongoDB');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// app.post('/api/signin', async (req, res) => {
//   const { email, password } = req.body;

//   console.log(email, password);
//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials' } + console.log(" invalid user"));
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Invalid credentials' } + console.log(" invalid pasward"));
//     }

//     res.status(200).json({ message: 'User authenticated successfully' });
//     console.log("User authenticated successfully");
//     // res.sendFile(path.join(__dirname+'./khan.html'));
//     // const filePath = path.join(__dirname, 'khan.html');
  
//     // // Send the file using res.sendFile
//     // res.sendFile(filePath);

//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred' });
//     console.log("an error accured");
//   }
// });

app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token to the client
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



