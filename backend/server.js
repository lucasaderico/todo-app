import express from "express";
import cors from "cors";
import path from "path";
import todos from "./routes/todo.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/error.js";
import notFound from "./middleware/notFound.js";
const port = process.env.PORT || 8000;

const app = express();

app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger middleware
app.use(logger);

// Static folder
app.use(express.static(path.join("..", "frontend")));

// Routes
app.use("/api/todos", todos);

// Error handler
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
