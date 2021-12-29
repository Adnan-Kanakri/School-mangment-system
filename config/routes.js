const adminAuthRouter = require("../routes/admin/authAdmin");
const teacherRouter = require("../routes/teachers/authTeacher");

exports.allRoutes=(app)=>{
    app.use("/admin/auth", adminAuthRouter);
    app.use("/teacher/auth",teacherRouter);
    // app.use(errorRouter);
}