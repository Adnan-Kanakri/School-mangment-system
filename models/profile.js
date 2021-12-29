const mongoose = require("mongoose");

const schema = mongoose.Schema;

const profileScheam = new schema({

    adminId: {
        type:schema.Types.ObjectId,
        ref:"Admins"
    },
    sudentId:{
        type:schema.Types.ObjectId,
        ref:"Students"
    },
    teacherId:{
        type:schema.Types.ObjectId,
        ref:"Teachers"
    },
});
