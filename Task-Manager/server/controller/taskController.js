const taskModel = require("../models/Task");
const projectModel = require("../models/Project");


// ✅ CREATE TASK
async function createTaskController(req, res) {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            projectId,
            assignedTo
        } = req.body;

        // validate required fields
        if (!title || !projectId || !assignedTo) {
            return res.status(400).json({
                message: "Title, projectId and assignedTo are required"
            });
        }

        const project = await projectModel.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // check if assigned user is project member
        const isMember = project.members.some(
            (m) => m.toString() === assignedTo
        );

        if (!isMember) {
            return res.status(400).json({
                message: "User is not a project member"
            });
        }

        const task = await taskModel.create({
            title,
            description,
            priority,
            dueDate,
            project: projectId,
            assignedTo,
            createdBy: req.user.id
        });

        const populatedTask = await task.populate([
            { path: "assignedTo", select: "username email role" },
            { path: "project", select: "name" }
        ]);

        res.status(201).json({
            message: "Task created successfully",
            task: populatedTask
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


// ✅ GET TASKS
async function getTasksController(req, res) {
    try {
        let filter = {};

        // Admin sees tasks they created
        if (req.user.role === "Admin") {
            filter = { createdBy: req.user.id };
        }
        // Members see tasks assigned to them
        else {
            filter = { assignedTo: req.user.id };
        }

        const tasks = await taskModel
            .find(filter)
            .populate("assignedTo", "username email role")
            .populate("project", "name");

        res.status(200).json({
            tasks
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


// ✅ UPDATE TASK STATUS
async function updateTaskStatusController(req, res) {
    try {
        const taskId = req.body.taskId || req.params.taskId;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }

        const task = await taskModel.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // only assigned user can update status
        if (task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Only assigned user can update task status"
            });
        }

        task.status = status;
        await task.save();

        const updatedTask = await task.populate([
            { path: "assignedTo", select: "username email role" },
            { path: "project", select: "name" }
        ]);

        res.status(200).json({
            message: "Task status updated successfully",
            task: updatedTask
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


// ✅ EXPORTS
module.exports = {
    createTaskController,
    getTasksController,
    updateTaskStatusController
};