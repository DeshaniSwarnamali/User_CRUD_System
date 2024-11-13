require('dotenv').config(); // Load environment variables from .env
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection using mongoose
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB database."))
    .catch(err => console.error("Could not connect to MongoDB:", err));



// Define a schema and model for your collection
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    city: String,
});

const User = mongoose.model("collection1", userSchema); // Matches your collection name

// **CRUD Endpoints**

// 1. Create: Add a new user
app.post('/api/user', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// 2. Read: Get all users
app.get('/api/user', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 3. Read: Get a specific user by ID
app.get('/api/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("User not found");
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 4. Update: Modify an existing user's details
app.put('/api/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Validate the input
        });
        if (!user) return res.status(404).send("User not found");
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// 5. Delete: Remove a user by ID
app.delete('/api/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send("User not found");
        res.status(200).send({ message: "User deleted successfully", user });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
