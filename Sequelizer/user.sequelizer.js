const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const { date } = require("joi");

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
module.exports.isVerified = async (id) => {
  const user = await prisma.user.findFirst({
    where: { id: id, isVerified: true },
  });
  if (!user) return false;
  return true;
};

module.exports.getOrCreateNewUser = async (profile, provider) => {
  let user = await prisma.user.findFirst({
    where: { email: profile.email, isVerified: true },
  });
  if (user) {
    console.log(user);
    return { alreadyRegisteredError: true };
  }
  
  user = await prisma.user.create({
    data: {
      name: profile.first_name + " " + profile.last_name,
      email: profile.email,
      password: "20120022@)!@))@@",
    },
  });
  await prisma.userOnSocial.create({
    data: {
      name: String(provider),
      userId: Number(user.id),
    },
  });
  return { alreadyRegisteredError: false, user: user };
};

module.exports.createPasswordReset = async (userId) => {
  const code = Math.floor(1000 + Math.random() * 9000);
  const userReset = await prisma.passwordReset.create({
    data:{
      userId:userId,
      code: String(code)
    },
    include:{
      user:true
    }
  });
  return userReset;
}


//------------------------get user by code---------------
module.exports.getUserByCode = async (code) => {
  let hourAgo = new Date();
  hourAgo.setHours(hourAgo.getHours() - 1);
  const userReset = await prisma.passwordReset.findFirst({
    where: {
      code:code,
      createdAt:{
        lt: new Date(),
        gte: hourAgo
      }
    },
    include:{
      user:true
    }
  });
  return userReset;
}

//------------------------reset password---------------
module.exports.resetPassword = async (userId,password) => {
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  const user = await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      password:newPassword
    },
  });
  await prisma.passwordReset.deleteMany({
    where:{
      userId:userId,
    }
  });
  return user;
}
