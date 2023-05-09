interface todoRepositoryGetParams {
    page: number;
    limit: number;
}
interface todoRepositoryGetOutput {
    todos: Todo[];
    totalTodos: number;
    totalPages: number;
}

function get({
    page,
    limit,
}: todoRepositoryGetParams): Promise<todoRepositoryGetOutput> {
    return fetch("/api/todos").then(async (responseServer) => {
        const todosString = await responseServer.text();
        const todosFromServer = parseTodosFromServer(
            JSON.parse(todosString)
        ).todos;

        const ALL_TODOS = todosFromServer;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
        const totalPages = Math.ceil(ALL_TODOS.length / limit);

        return {
            todos: paginatedTodos,
            totalTodos: ALL_TODOS.length,
            totalPages,
        };
    });
}

export const todoRepository = {
    get,
};

//Model
interface Todo {
    id: string;
    content: string;
    date: Date;
    done: boolean;
}

function parseTodosFromServer(responseBody: unknown): { todos: Array<Todo> } {
    if (
        responseBody !== null &&
        typeof responseBody === "object" &&
        "todos" in responseBody &&
        Array.isArray(responseBody.todos)
    ) {
        return {
            todos: responseBody.todos.map((todo: unknown) => {
                if (todo === null && typeof todo !== "object") {
                    throw new Error("Invalid todo from API");
                }

                const { id, content, done, date } = todo as {
                    id: string;
                    content: string;
                    done: string;
                    date: string;
                };

                return {
                    id,
                    content,
                    done: String(done).toLowerCase() === "true",
                    date: new Date(date),
                };
            }),
        };
    }

    return {
        todos: [],
    };
}
