const { incrementTaskRowCount } = require('./tasks');
const { userModel } = require('../models/users');

const rollbackNAddedUsers = async (n) => {
  if(isNaN(n)) throw new Error("Entered value should be number");
  const data =  await  userModel.find().sort({timestamp:-1}).limit(n);
  for(let i=0;i<data.length;i++) {
          const {_id} = data[i];
          await userModel.findByIdAndDelete(_id).exec();
  }
}

const addUser = async (obj) => {
  console.log(obj);
  await incrementTaskRowCount();
  return await userModel.create({
          object: obj
  })
}

const getUserCount = async () => {
  return await userModel.countDocuments().exec();
}

const getNthInSortedUser = async (n) => {
  return await userModel.find().sort({timestamp: 1}).skip(n).limit(1);
}
module.exports = {
  rollbackNAddedUsers,
  addUser, 
  getUserCount,
  getNthInSortedUser
}