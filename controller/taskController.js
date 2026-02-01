import { query } from "../config/db.js";

export const getAllTasksController = async (req, res) => {
    try {
        const { status, sort } = req.query;
        let queryText = "SELECT * FROM tasks";
        const queryParams = [];

        if (status) {
            queryText += " WHERE status = $1";
            queryParams.push(status);
        }

        if (sort === 'desc') {
            queryText += " ORDER BY created_at DESC";
        } else {
            queryText += " ORDER BY created_at ASC";
        }

        const result = await query(queryText, queryParams);
        res.status(200).send({
            success: true,
            message: "Tasks fetched successfully",
            data: result.rows
        })
    } catch (error) {
        console.log(error)
        res.status(504).send({
            success: false,
            message: "Error in fetching tasks",
            error: error.message
        })
    }
}


export const createNewTaskController = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        if (!title || !description) {
            return res.status(400).send({
                success: false,
                message: "Title, description and status are required",
            })
        }

        if (title.length < 3) {
            return res.status(400).send({
                success: false,
                message: "Title must be at least 3 characters long",
            })
        }


        const result = status ? await query("INSERT INTO tasks (title, description,status) VALUES ($1, $2,$3) RETURNING *", [title, description ?? null, status]) :
            await query("INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *", [title, description ?? null]);

        res.status(201).send({
            success: true,
            message: "Task created successfully",
            data: result.rows[0]
        })
    } catch (error) {
        console.log(error)
        res.status(504).send({
            success: false,
            message: "Error in creating task",
            error: error.message
        })
    }
}



export const updateTaskController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).send({
                success: false,
                message: "status is required",
            })
        }

        let queryText = "UPDATE tasks SET status = $1";
        const params = [status, id];

        if (status === 'completed') {
            queryText += ", completed_at = CURRENT_TIMESTAMP";
        } else {
            queryText += ", completed_at = NULL";
        }

        queryText += " WHERE id = $2 RETURNING *";

        const result = await query(queryText, params);
        res.status(200).send({
            success: true,
            message: "Task updated successfully",
            data: result.rows[0]
        })
    } catch (error) {
        console.log(error)
        res.status(504).send({
            success: false,
            message: "Error in updating task",
            error: error.message
        })
    }
}

export const getTaskMetricsController = async (req, res) => {
    try {
        const countResult = await query(`
            SELECT 
                COUNT(*) as total_tasks,
                COUNT(*) FILTER (WHERE status = 'todo') as todo_count,
                COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_count,
                COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
                AVG(EXTRACT(EPOCH FROM (completed_at - created_at))) FILTER (WHERE status = 'completed') as avg_completion_time_seconds
            FROM tasks
        `);

        const metrics = countResult.rows[0] || {};

        res.status(200).send({
            success: true,
            message: "Metrics fetched successfully",
            data: {
                totalTasks: parseInt(metrics.total_tasks || 0),
                counts: {
                    todo: parseInt(metrics.todo_count || 0),
                    in_progress: parseInt(metrics.in_progress_count || 0),
                    completed: parseInt(metrics.completed_count || 0)
                },
                avgCompletionTimeSeconds: Math.round(parseFloat(metrics.avg_completion_time_seconds || 0))
            }
        })
    } catch (error) {
        console.log(error)
        res.status(504).send({
            success: false,
            message: "Error in fetching metrics",
            error: error.message
        })
    }
}


