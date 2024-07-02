import server from "./app";

const port = process.env.PORT || 3300;

server.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
