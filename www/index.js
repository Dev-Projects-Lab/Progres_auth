const application = require("../src/app.js");
require("dotenv").config();

const port = process.env.PORT;

application.listen(port, () =>
  console.log(
    `\n ==> Serveur demarrée sur l'url : http://localhost:${port} 😋😋😋😋😋😋  !!!\n`
  )
);
