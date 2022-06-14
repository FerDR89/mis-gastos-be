require("dotenv").config();
import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import { sendCodeByEmail, sendToken } from "./controllers/auth-controller";
import {
  findAllIncomes,
  createNewIncome,
  updateIncome,
  deleteIncome,
} from "./controllers/income-controller";
import { validateEmail, validateNumber, validateString } from "./schemas";
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
  const checkedEmail: string | void = await validateEmail(email);
  const checkedCode: number | void = await validateNumber(code);
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
app.get("/incomes", authMiddleware, async (req: any, res) => {
  if (req._data === null) {
    res.status(401).json({
      message: "Unauthorized",
    });
  } else {
    try {
      const { userId } = req._data;
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
  }
});

//Recibe el token del usuario, confirma que este autenticado y crea un ingreso (debo asignarle un id)
app.post("/incomes", authMiddleware, async (req: any, res) => {
  if (req._data === null) {
    res.status(401).json({
      message: "Unauthorized",
    });
  } else if (!req.body.income) {
    res.status(400).json({
      message: "Bad request",
    });
  } else {
    try {
      const validatedNumber: number | void = await validateNumber(
        req.body.income
      );
      if (!validatedNumber) {
        res.status(400).json({
          message: "Bad request",
        });
      } else {
        const userId = req._data.userId;
        //Ver como tipar esto sin tener que castearlo
        const newIncome = await createNewIncome(
          validatedNumber as number,
          userId
        );
        if (newIncome === null) {
          res.status(500).json({
            message: "Internal server error",
          });
        }
        res.send({ createdIncome: true });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

//Recibe el token del usuario, confirma que este autenticado y actualiza un ingreso especifico
app.patch("/incomes/:incomeId", authMiddleware, async (req: any, res) => {
  if (req._data === null) {
    res.status(401).json({
      message: "Unauthorized",
    });
  } else if (!req.body.income) {
    res.status(400).json({
      message: "Bad request",
    });
  } else {
    try {
      const incomeId: string = req.params.incomeId;
      const validatedIncome: number | void = await validateNumber(
        req.body.income
      );
      if (incomeId && validatedIncome) {
        const income = await updateIncome(incomeId, validatedIncome as number);
        if (!income) {
          res.status(500).json({
            message: "Internal server error",
          });
        }
        res.send({ updatedIncome: true });
      } else {
        res.status(400).json({
          message: "No entra acá",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

//Recibe el token del usuario, confirma que este autenticado y borra un ingreso especifico.
app.delete("/incomes/:incomeId", authMiddleware, async (req: any, res) => {
  if (req._data === null) {
    res.status(401).json({
      message: "Unauthorized",
    });
  } else {
    try {
      const income = await deleteIncome(req.params.incomeId);
      if (income === null) {
        res.status(500).json({
          message: "Internal server error",
        });
      }
      res.send({ deletedIncome: true });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

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
