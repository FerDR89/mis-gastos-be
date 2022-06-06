import * as express from "express";
import * as cors from "cors";
import * as path from "path";
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

//Busca el usuario en la db a traves del mail, si no lo encuentra lo crea.
//A su vez genera un código random (se guarda en la db y tiene un tiempo de expiración)
//y lo envia por mail para que inicie sesión. (desde el front debería de guardarse el email para adjuntarlo al código
//  que el usuario recibe/ingresa)
app.post("/auth", (req, res) => {});

//Chequea en la db que el mail exista y que el código recibido sea el mismo para devolver un token valido.
app.post("/auth/token", (req, res) => {});

//Recibe el token del usuario, confirma que este autenticado y devuelve todos los ingresos asociados a ese usuario.
// app.get("/income/:userId", (req, res) => {});

//Recibe el token del usuario, confirma que este autenticado y crea un ingreso (debo asignarle un id)
//En el front puedo recibir todos los ingresos y realizar allí la sumatoría de todos
// app.post("/income/:userId", (req, res) => {});

//Recibe el token del usuario, confirma que este autenticado y actualiza un ingreso especifico
// app.patch("/income/:userId", (req, res) => {});

// app.get("/expense/:userId", (req, res) => {});

//En el front puedo recibir todos los ingresos y realizar allí la sumatoría de todos
// app.post("/expense/:userId", (req, res) => {});
// app.patch("/expense/:userId", (req, res) => {});
// app.delete("/expense/:userId", (req, res) => {});

app.listen(port, () => {
  console.log("SVR ON", port);
});
