import Server from "./services/server.js";

/////////////////////Servidor Escuchando//////////////
const PORT = process.env.PORT || 8080;
Server.listen(PORT, () => console.log("Server up en puerto", PORT));
Server.on("error", (error) => {
  console.log("Server Error Catch!", error);
});
////////////////////////////////////////////////////////