require("dotenv").config();
import * as express from "express";
import * as cors from "cors";
import { sendCodeByEmail, sendToken } from "./controllers/auth-controller";
import {
  findAllIncomes,
  createNewIncome,
  updateIncome,
  deleteIncome,
} from "./controllers/income-controller";
import {
  findAllExpenses,
  createNewExpense,
  updateExpense,
  deleteExpense,
} from "./controllers/expense-controller";

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
  const parsedCode = parseInt(code);
  const checkedEmail: string | void = await validateEmail(email);
  const checkedCode: number | void = await validateNumber(parsedCode);
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
      const parsedIncome = parseInt(req.body.income);
      const validatedIncome: number | void = await validateNumber(parsedIncome);
      const validatedType: string | void = await validateString(req.body.type);
      if (!validatedIncome || !validatedType) {
        res.status(400).json({
          message: "Bad request",
        });
      } else {
        const userId = req._data.userId;
        const newIncome = await createNewIncome(
          validatedIncome as number,
          userId,
          validatedType as string
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
      const parsedIncome = parseInt(req.body.income);
      const validatedIncome: number | void = await validateNumber(parsedIncome);
      const validatedType: string | void = await validateString(req.body.type);
      if (incomeId && validatedIncome && validatedType) {
        const income = await updateIncome(
          incomeId,
          validatedIncome as number,
          validatedType as string
        );
        if (!income) {
          res.status(500).json({
            message: "Internal server error",
          });
        }
        res.send({ updatedIncome: true });
      } else {
        res.status(400).json({
          message: "Bad request",
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

//Recibe el token del usuario, confirma que este autenticado y devuelve todos los egresos registraodos
app.get("/expense", authMiddleware, async (req: any, res) => {
  if (req._data === null) {
    res.status(401).json({
      message: "Unauthorized",
    });
  } else {
    try {
      const { userId } = req._data;
      const allUserExpenses = await findAllExpenses(userId);
      if (allUserExpenses === null) {
        res.status(200).json({
          results: [],
        });
      } else {
        res.send({ results: allUserExpenses });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

//Recibe el token del usuario, confirma que este autenticado y crea un egreso
app.post("/expense", authMiddleware, async (req: any, res) => {
  if (req._data === null) {
    res.status(401).json({
      message: "Unauthorized",
    });
  } else if (!req.body.expense) {
    res.status(400).json({
      message: "Bad request",
    });
  } else {
    try {
      const parsedExpense = parseInt(req.body.expense);
      const validatedExpense: number | void = await validateNumber(
        parsedExpense
      );
      const validatedType: string | void = await validateString(req.body.type);
      if (!validatedExpense || !validatedType) {
        res.status(400).json({
          message: "Bad request",
        });
      } else {
        const userId = req._data.userId;
        const newExpense = await createNewExpense(
          validatedExpense as number,
          userId,
          validatedType as string
        );
        if (newExpense === null) {
          res.status(500).json({
            message: "Internal server error",
          });
        }
        res.send({ createdExpense: true });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

//Recibe el token del usuario, confirma que este autenticado y actualiza un egreso especifico
app.patch("/expense/:expenseId", authMiddleware, async (req: any, res) => {
  if (req._data === null) {
    res.status(401).json({
      message: "Unauthorized",
    });
  } else if (!req.body.expense) {
    res.status(400).json({
      message: "Bad request",
    });
  } else {
    try {
      const expenseId: string = req.params.expenseId;
      const parsedExpense = parseInt(req.body.expense);
      const validatedExpense: number | void = await validateNumber(
        parsedExpense
      );
      const validatedType: string | void = await validateString(req.body.type);
      if (expenseId && validatedExpense && validatedType) {
        const expense = await updateExpense(
          expenseId,
          validatedExpense as number,
          validatedType as string
        );
        if (!expense) {
          res.status(500).json({
            message: "Internal server error",
          });
        }
        res.send({ updatedExpense: true });
      } else {
        res.status(400).json({
          message: "Bad request",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

//Recibe el token del usuario, confirma que este autenticado y borra un egreso especifico.
app.delete("/expense/:expenseId", authMiddleware, async (req: any, res) => {
  if (req._data === null) {
    res.status(401).json({
      message: "Unauthorized",
    });
  } else {
    try {
      const expense = await deleteExpense(req.params.expenseId);
      if (expense === null) {
        res.status(500).json({
          message: "Internal server error",
        });
      }
      res.send({ deletedExpense: true });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

app.listen(port, () => {
  console.log("SVR ON", port);
});
