const mongoose = require('mongoose');
require("dotenv").config('./.env');

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("connected to mongodb");
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}