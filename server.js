const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => console.log('Connected to MongoDB successfully...👍'))
  .catch((err) => console.log(err.message));

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
