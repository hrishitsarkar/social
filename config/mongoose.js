const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/codeial_development');
}

const db = mongoose.connection;

db.once('open',()=>{
    console.log('Connected to DB :: MongoDB')
});

module.exports = db;