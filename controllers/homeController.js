module.exports = (req, res) => {
  res.status(200).send({
    status: 'success',
    data: {
      message: 'Welcome to Vidly',
      app: 'Vidly',
      requestTime: new Date().toLocaleString('en-AU'),
    },
  });
};
