const Notic = require("../models/notic");

exports.findById = async (id) => {
  const notic = await Notic.findById(id);
  return notic;
};

exports.save = async (notie, payload) => {
  const notic = new Notic({
    noticLine: notie,
  });
  setCreateId(notic, payload);
  await notic.save();
};

exports.getLastOne = async () => {
  let lastAdd = await Notic.findOne(
    {},
    {},
    {
      sort: {
        createdAt: -1,
      },
    }
  );
  return lastAdd;
};

exports.getfirstOne = async () => {
  let lastAdd = await Notic.findOne(
    {},
    {},
    {
      sort: {
        createdAt: 1,
      },
    }
  );
  return lastAdd;
};

exports.getAll = async () => {
  let lastAdd = await Notic.find();
  return lastAdd;
};

exports.deleteNotic = async (id) => {
  let lastAdd = await Notic.findByIdAndDelete(id);
  return lastAdd;
};

exports.deleteAllNotic = async () => {
  let lastAdd = await Notic.deleteMany();
  return lastAdd;
};
function setCreateId(notic, payload) {
  if (payload.type == "admin") {
    notic.adminId = payload.adminId;
  } else {
    notic.teacherId = payload.teacherId;
  }
  notic.creator = payload.type;
}
