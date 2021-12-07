const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Genre = require('../models/genreModel');
// const Customer = require('../models/customerModel');
const Movie = require('../models/movieModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => console.log('DB connected successfully'))
  .catch((err) => console.log(err.message));

// READ FILE
// const genres = JSON.parse(fs.readFileSync(`${__dirname}/genres.json`, 'utf-8'));
// const customers = JSON.parse(
//   fs.readFileSync(`${__dirname}/customers.json`, 'utf-8')
// );

// let movies = JSON.parse(fs.readFileSync(`${__dirname}/movies.json`, 'utf-8'));
let movies = JSON.parse(fs.readFileSync(`${__dirname}/movies.json`));

// IMPORT DATA INTO DATABASE
const importData = async () => {
  let genres = [];
  try {
    // await Genre.create(genres);
    // await Customer.create(customers);
    for (let i = 0; i < movies.length; i++) {
      const genre = await Genre.findById(movies[i].genreId);
      genres.push(genre);
    }
    movies = movies.map((movie, indx) => {
      return {
        title: movie.title,
        genre: genres[indx],
        numberInStock: movie.numberInStock,
        dailyRentalRate: movie.dailyRentalRate,
      };
    });
    await Movie.create(movies);
    console.log('Import data into DB successfully');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    // await Genre.deleteMany();
    // await Customer.deleteMany();
    await Movie.deleteMany();
    console.log('Delete all data in DB successfully');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
