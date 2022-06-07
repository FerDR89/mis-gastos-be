require("dotenv").config();
import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import { User } from "./models/user";
import { validateEmail } from "./schemas";

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json())

//Busca el usuario en la db a traves del mail, si no lo encuentra lo crea.
//A su vez genera un código random (se guarda en la db y tiene un tiempo de expiración)
//y lo envia por mail para que inicie sesión. (desde el front debería de guardarse el email para adjuntarlo al código
//  que el usuario recibe/ingresa)
app.post("/auth", async (req, res) => {
  const email = req.body.email
  const checkedEmail = await validateEmail({ email })
  if (!checkedEmail) {
    res.status(400).json({
      message: "Invalid data"
    })
  }
  else {
    try {
      //Aca debería estar un controller para no acceder directo al model.
      // const response = await User.createNewUser({ email })
      res.send("ok Email")
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error"
      })
    }
  }
});

//Chequea en la db que el mail exista y que el código recibido sea el mismo para devolver un token valido.
app.post("/auth/token", (req, res) => { });

//Recibe el token del usuario, confirma que este autenticado y devuelve todos los ingresos asociados a ese usuario.
//En el front puedo recibir todos los ingresos y realizar allí la sumatoría de todos
//El userId lo extraigo del token
// app.get("/income", (req, res) => {});

//Recibe el token del usuario, confirma que este autenticado y crea un ingreso (debo asignarle un id)
//El userId lo extraigo del token, del body saco el incomeId
// app.post("/income", (req, res) => {});

//Recibe el token del usuario, confirma que este autenticado y actualiza un ingreso especifico
//El userId lo extraigo del token, del body saco el incomeId
// app.patch("/income", (req, res) => {});

//Recibe el token del usuario, confirma que este autenticado y borra un ingreso especifico.
//El userId lo extraigo del token, del body saco el incomeId
// app.delete("/incomed", (req, res) => {});

//En el front puedo recibir todos los egresos y realizar allí la sumatoría de todos
// app.get("/expense/:userId", (req, res) => {});

//Recibe el token del usuario, confirma que este autenticado y crea un egreso (debo asignarle un id)
//El userId lo extraigo del token, del body saco el expenseId
// app.post("/expense", (req, res) => {});

//Recibe el token del usuario, confirma que este autenticado y actualiza un egreso
//El userId lo extraigo del token, del body saco el expenseId
// app.patch("/expense", (req, res) => {});

//Recibe el token del usuario, confirma que este autenticado y borra un egreso (debo asignarle un id)
//El userId lo extraigo del token, del body saco el expenseId
// app.delete("/expense", (req, res) => {});

app.listen(port, () => {
  console.log("SVR ON", port);
});
