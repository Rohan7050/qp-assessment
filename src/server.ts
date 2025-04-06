import app from "./app";

const PORT = process.env.PORT || 5000;

// To Do: initiate database connection
import { AppDataSource } from "./db/db.config"

AppDataSource.initialize().then(async () => {
  console.log("Connected to database")
  await AppDataSource.synchronize(false);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => console.log(error))

