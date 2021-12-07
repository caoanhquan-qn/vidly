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
  .then(() => console.log('DB connected successfully'))
  .catch((err) => console.log(err.message));

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
