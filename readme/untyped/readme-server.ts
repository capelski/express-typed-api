import express from 'express';

const app = express();

app.get('/api/weather/:cityName', (req) => {
  if (req.params.cityName.length < 3) {
    return {
      payload: { errorMessage: 'City name must have at least 3 characters' },
      status: 400,
    };
  }

  return {
    payload: {
      /** ... */
    },
  };
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server up and running!');
});
