const projectModel = require("../models/Project");
const userModel = require("../models/User");


// ✅ CREATE PROJECT
async function createProjectController(req, res) {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Project name required"
            });
        }

        const project = await projectModel.create({
            name,
            description,
            admin: req.user.id,
            members: [req.user.id]
        });

        const populatedProject = await projectModel.findById(project._id)
            .populate("admin", "username email role")
            .populate("members", "username email role");

        res.status(201).json({
            message: "Project created successfully",
            project: populatedProject
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


// ✅ GET ALL PROJECTS (user is member OR admin)
async function getProjectsController(req, res) {
    try {
        const projects = await projectModel.find({
            $or: [
                { admin: req.user.id },
                { members: req.user.id }
            ]
        })
            .populate("admin", "username email role")
            .populate("members", "username email role");

        res.status(200).json({
            projects
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


// ✅ ADD MEMBER (ADMIN ONLY)
async function addMemberController(req, res) {
    try {
        const projectId = req.params.projectId || req.body.projectId;
        const { userId } = req.body;

        const project = await projectModel.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // check admin
        if (project.admin.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Only admin can add members"
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // avoid duplicates
        const isAlreadyMember = project.members.some(
            (member) => member.toString() === userId
        );

        if (isAlreadyMember) {
            return res.status(400).json({
                message: "User already a member"
            });
        }

        project.members.push(userId);
        await project.save();

        const updatedProject = await projectModel.findById(projectId)
            .populate("admin", "username email role")
            .populate("members", "username email role");

        res.status(200).json({
            message: "Member added successfully",
            project: updatedProject
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


// ✅ REMOVE MEMBER (ADMIN ONLY)
async function removeMemberController(req, res) {
    try {
        const projectId = req.params.projectId || req.body.projectId;
        const { userId } = req.body;

        const project = await projectModel.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // check admin
        if (project.admin.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Only admin can remove members"
            });
        }

        // prevent removing admin
        if (project.admin.toString() === userId) {
            return res.status(400).json({
                message: "Admin cannot remove themselves"
            });
        }

        project.members = project.members.filter(
            (member) => member.toString() !== userId
        );

        await project.save();

        const updatedProject = await projectModel.findById(projectId)
            .populate("admin", "username email role")
            .populate("members", "username email role");

        res.status(200).json({
            message: "Member removed successfully",
            project: updatedProject
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


// ✅ EXPORTS
module.exports = {
    createProjectController,
    getProjectsController,
    addMemberController,
    removeMemberController
};