import axios from "axios";
import express from "express";

const app = express();
const port = process.env.PORT || 3031;

app.use(express.json());

app.all("/*", (req, res) => {
  const recipient = req.originalUrl.split("/")[1];
  console.log(recipient);

  const recipientUrl = process.env[recipient];
  console.log(recipientUrl);

  if (recipientUrl) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientUrl}${req.originalUrl}`,
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
    };
    console.log(axiosConfig);

    axios(axiosConfig)
      .then((response) => {
        console.log(response);
        res.json(response.data);
      })
      .catch((error) => {
        console.log(error);

        if (error.response) {
          const { status, data } = error.response;
          res.status(status).json(data);
        } else {
          res.status(500).json({ error: error.message });
        }
      });
  } else {
    res.status(502).json({ error: "Cannot process request" });
  }
});

app.listen(port, () => console.log(`Service is running on ${port}`));
