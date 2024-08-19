import { dataFormatter, writeToFile, updateFile } from "../utils.js";
const dataPath = "./data/todos.txt";

// GET all todos
export const getTodo = async (req, res, next) => {
  try {
    const data = await dataFormatter(dataPath);

    const limit = req.query.limit;

    if (!isNaN(limit) && limit > 0) {
      return res.status(200).json(data.slice(0, limit));
    }

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

// CREATE new todo
export const createTodo = async (req, res, next) => {
  try {
    const name = req.body.name;

    if (!name) {
      const error = new Error(`Please include a name`);
      error.status = 400;
      return next(error);
    }

    await writeToFile(dataPath, `${name},\n`);
    const data = await dataFormatter(dataPath);
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
  }
};

// UPDATE todo
export const updateTodo = async (req, res, next) => {
  try {
    const data = await dataFormatter(dataPath);
    const id = parseInt(req.params.id);

    const todo = data.find((todo) => todo.id === id);

    if (!todo) {
      const error = new Error(`ToDo with the id ${id} was not found`);
      error.status = 404;
      return next(error);
    }

    todo.name = req.body.name;

    await updateFile(dataPath, data);

    const newData = await dataFormatter(dataPath);

    res.status(200).json(newData);
  } catch (error) {
    console.log(error);
  }
};

// DELETE todo
export const deleteTodo = async (req, res, next) => {
  const data = await dataFormatter(dataPath);
  const id = parseInt(req.params.id);

  const idx = data.indexOf(data.find((todo) => todo.id === id));

  if (idx < 0) {
    const error = new Error(`ToDo with the id ${id} was not found`);
    error.status = 404;
    return next(error);
  }

  data.splice(idx, 1);

  await updateFile(dataPath, data);

  const newData = await dataFormatter(dataPath);

  res.status(200).json(newData);
};
