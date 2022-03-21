const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ----------------------------Get All Roles--------------
module.exports.all = async (email) => {
  const roles = await prisma.role.findMany({
    include:{permissions:{
      select:{
        permission:{
          select:{
            id:true,
            name:true,
            slug:true,
          }
        }
      },
      
    }}
  });
  return roles;
};

// ----------------------------Create Roles--------------
module.exports.create = async (data) => {
  const isRole = await this.findBySlug(data.slug);
  if (isRole) {
    return false;
  }
  const role = await prisma.role.create({
    data: {
      name: data.name,
      slug: data.slug,
    },
  });
  return role;
};

// ----------------------------Delete Role--------------
module.exports.delete = async (id) => {
  const isRole = await this.findById(id);
  if (!isRole) {
    return false;
  }
  const role = await prisma.role.delete({
    where: { id: id },
  });
  return role;
};

//--------------------------Get Role By Name---------------
module.exports.findBySlug = async (slug) => {
  const role = await prisma.role.findFirst({
    where: { slug: slug },
  });
  return role;
};

//--------------------------Get Role By Name---------------
module.exports.findById = async (id) => {
  const role = await prisma.role.findFirst({
    where: { id: id },
  });
  return role;
};

// ----------------------------Assign Role To User--------------
module.exports.assignToUser = async (data) => {
  const roleData = await this.findById(data.roleId);
  if (!roleData) {
    return false;
  }
  const role = await prisma.usersOnRoles.upsert({
    where: {
      userId_roleId: {
        roleId: data.roleId,
        userId: data.userId,
      },
    },
    update: {},
    create: {
      userId: data.userId,
      roleId: data.roleId,
    },
  });
  return role;
};


// ----------------------------Assign Permission to Role--------------
module.exports.assignPermission = async (data) => {
  const roleData = await this.findById(data.roleId);
  if (!roleData) {
    return false;
  }
  const permissionData = await prisma.permission.findFirst({
    where: { id: data.permissionId },
  });
  if (!permissionData) {
    return false;
  }
  const role = await prisma.rolesOnPermissions.upsert({
    where: {
      permissionId_roleId: {
        permissionId: data.permissionId,
        roleId: data.roleId,
      },
    },
    update: {},
    create: {
      permissionId: data.permissionId,
      roleId: data.roleId,
    },
  });
  return role;
};

