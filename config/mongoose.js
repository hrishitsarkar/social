const mongoose = require('mongoose');
const env = require('./environment');

main().catch(err => console.log(err));

async function main(){
    await mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`);
}

const db = mongoose.connection;

db.once('open',()=>{
    console.log('Connected to DB :: MongoDB')
});

module.exports = db;