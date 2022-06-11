require("dotenv").config();
import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import { sendCodeByEmail, sendToken } from "./controllers/auth-controller";
import { findAllIncomes } from "./controllers/income-controller";
import { validateEmail, validateCode } from "./schemas";
import { authMiddleware } from "./lib/middlewares";
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.post("/auth", async (req, res) => {
  const email = req.body.email;
  const checkedEmail = await validateEmail(email);
  if (!checkedEmail) {
    res.status(400).json({
      message: "Invalid data",
    });
  } else {
    try {
      const result = await sendCodeByEmail(checkedEmail);
      if (!result) {
        res.status(500).json({
          message: "Internal server error",
        });
      } else {
        res.status(200).send({ result });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

//Chequea en la db que el mail exista y que el código recibido sea el mismo para devolver un token valido.
app.post("/auth/token", async (req, res) => {
  const { email, code } = req.body;
  const checkedEmail = await validateEmail(email);
  const checkedCode = await validateCode(code);
  if (checkedEmail && checkedCode) {
    try {
      const token = await sendToken(checkedEmail, checkedCode);
      if (token === null) {
        res.status(401).json({
          message: "Unauthorized",
        });
      } else {
        res.status(200).send({ token });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  } else {
    res.status(400).json({
      message: "Invalid data",
    });
  }
});

//Recibe el token del usuario, confirma que este autenticado y devuelve todos los ingresos asociados a ese usuario.
//En el front puedo recibir todos los ingresos y realizar allí la sumatoría de todos
//El userId lo extraigo del token
app.get("/incomes", authMiddleware, async (req: any, res) => {
  const { userId } = req._data;
  if (!userId) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
  try {
    const allUserIncomes = await findAllIncomes(userId);
    if (allUserIncomes === null) {
      res.status(200).json({
        results: [],
      });
    } else {
      res.send({ results: allUserIncomes });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

//Recibe el token del usuario, confirma que este autenticado y crea un ingreso (debo asignarle un id)
//El userId lo extraigo del token, del body saco el incomeId
// app.post("/incomes", async (req:any, res) => {});

//Recibe el token del usuario, confirma que este autenticado y actualiza un ingreso especifico
//El userId lo extraigo del token, del body saco el incomeId
// app.patch("/incomes/:incomeId", async (req:any, res) => {});

//Recibe el token del usuario, confirma que este autenticado y borra un ingreso especifico.
//El userId lo extraigo del token, del body saco el incomeId
// app.delete("/incomes/:incomeId", async (req:any, res) => {});

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
