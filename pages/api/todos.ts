import { NextApiRequest, NextApiResponse } from "next";
import { todoController } from "@server/controller/todos";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        todoController.get(req, res);
        return;
    }

    res.status(405).json({
        message: "Method not allowed",
    });
}
