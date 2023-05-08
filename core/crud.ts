import fs from "fs";
import { v4 as uuid } from "uuid";
const DB_FILE_PATH = "./core/db";

interface Todo {
    id: string;
    date: string;
    content: string;
    done: boolean;
}

function create(content: string): Todo {
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content,
        done: false,
    };
    const todos: Todo[] = [...read(), todo];
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos }, null, 2));
    return todo;
}

function update(id: string, change: Partial<Todo>): Todo {
    let updatedTodo;
    const todos = read();

    todos.forEach((currentTodo) => {
        const isToUpdate = currentTodo.id === id;
        if (isToUpdate) {
            updatedTodo = Object.assign(currentTodo, change);
        }
    });

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos }, null, 2));

    if (!updatedTodo) {
        throw new Error("please, provider another id");
    }

    return updatedTodo;
}

export function read(): Array<Todo> {
    const content = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const db = JSON.parse(content || "{}");
    if (!db.todos) {
        return [];
    }
    return db.todos;
}

function deleteById(id: string) {
    const todos = read();

    const todosWithoutOne = todos.filter((todo) => {
        if (id === todo.id) {
            return false;
        }
    });

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify({ todos: todosWithoutOne }, null, 2)
    );
}

function clearDB() {
    fs.writeFileSync(DB_FILE_PATH, "");
}
