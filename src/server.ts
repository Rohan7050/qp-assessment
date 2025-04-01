import app from "./app";

const PORT = process.env.PORT || 5000;

// To Do: initiate database connection

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
