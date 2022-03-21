const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ----------------------------Check if user exists in our database--------------
module.exports.isUser = async (email) => {
  const user = await prisma.user.findFirst({
    where: { email: email },
  });
  if (!user) return false;
  return true;
};

// ----------------------------Check if add user to  database database-------------
module.exports.addUser = async (data) => {
  const code = Math.floor(1000 + Math.random() * 9000);
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(data.password, salt);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      verificationCode: String(code),
      password: password,
    },
  });

  return user;
};

//-----------------------------------Get a user by his ID----------------------------
module.exports.getUserById = async (id) => {
  const user = await prisma.user.findFirst({
    where: { id: id },
  });
  return user;
};

//-----------------------------------Get a user by his ID----------------------------
module.exports.getUserByEmail = async (email) => {
  const user = await prisma.user.findFirst({
    where: { email: email },
  });
  return user;
};

// ---------------------------- check if the code is valid----------------------------
module.exports.isCodeValid = async (data) => {
  const user = await prisma.user.findFirst({
    where: {
      id: Number(data.id),
      verificationCode: data.verificationCode,
    },
  });
  if (!user) return false;
  return true;
};

//-----------------------Verify user ---------------------------------------------------
module.exports.verifyUser = async (data) => {
  const user = await prisma.user.update({
    where: {
      id: Number(data.id),
    },
    data: {
      isVerified: true,
      verificationCode: null,
    },
  });
  return user;
};

//------------------------ Check if user is verified ------------------------------------
module.exports.isVerified = async (id) =>{
  const user = await prisma.user.findFirst({
    where: { id: id, isVerified:true},
  });
  if(!user) return false;
  return true;
}
