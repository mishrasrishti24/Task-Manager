const { Router } = require("express")

const {

    createTaskController,

    getTasksController,

    updateTaskStatusController

} = require("../controller/taskController")

const { authUser } =
    require("../middleware/authMiddleware")

const taskRouter = Router()



taskRouter.post(
    "/create",
    authUser,
    createTaskController
)



taskRouter.get(
    "/all",
    authUser,
    getTasksController
)



taskRouter.put(
    "/update-status",
    authUser,
    updateTaskStatusController
)



module.exports = taskRouter