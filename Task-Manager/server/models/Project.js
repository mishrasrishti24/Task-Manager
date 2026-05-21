const mongoose = require("mongoose")



const projectSchema =
new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    admin: {

        type:
        mongoose.Schema.Types.ObjectId,

        ref: "users",

        required: true

    },

    members: [

        {

            type:
            mongoose.Schema.Types.ObjectId,

            ref: "users"

        }

    ]

})



const projectModel =
mongoose.model(
    "projects",
    projectSchema
)



module.exports = projectModel