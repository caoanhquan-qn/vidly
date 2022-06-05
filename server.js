const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB =
  process.env.NODE_ENV === 'test' ? process.env.DATABASE_LOCAL_TEST : process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => console.log(`Connected to ${DB} successfully...👍`))
  .catch((err) => console.log(err.message));

const port = process.env.PORT || 1337;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

module.exports = server;
