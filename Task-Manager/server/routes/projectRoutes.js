const { Router } = require("express");

const {
    createProjectController,
    getProjectsController,
    addMemberController,
    removeMemberController
} = require("../controller/projectController");

const { authUser } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const projectRouter = Router();


// ✅ CREATE PROJECT
projectRouter.post(
    "/",
    authUser,
    authorizeRoles("Admin"),
    createProjectController
);


// ✅ GET ALL PROJECTS (for logged-in user)
projectRouter.get(
    "/",
    authUser,
    getProjectsController
);


// ✅ ADD MEMBER TO PROJECT
projectRouter.put(
    "/:projectId/add-member",
    authUser,
    authorizeRoles("Admin"),
    addMemberController
);


// ✅ REMOVE MEMBER FROM PROJECT
projectRouter.put(
    "/:projectId/remove-member",
    authUser,
    authorizeRoles("Admin"),
    removeMemberController
);


module.exports = projectRouter;