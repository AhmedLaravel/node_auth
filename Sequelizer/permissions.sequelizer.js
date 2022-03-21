const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ----------------------------Get All Permissions--------------
module.exports.all = async (email) => {
  const permissions = await prisma.permission.findMany();
  return permissions;
};

// ----------------------------Create Permission--------------
module.exports.create = async (data) => {
  const isPermission = await this.findBySlug(data.slug);
  if (isPermission) {
    return false;
  }
  const permission = await prisma.permission.create({
    data: {
      name: data.name,
      slug: data.slug,
    },
  });
  return permission;
};

// ----------------------------Delete Permission--------------
module.exports.delete = async (id) => {
  const isPermission = await this.findById(id);
  if (!isPermission) {
    return false;
  }
  const permission = await prisma.permission.delete({
    where: { id: id },
  });
  return permission;
};

//--------------------------Get Permission By Name---------------
module.exports.findBySlug = async (slug) => {
  const permission = await prisma.permission.findFirst({
    where: { slug: slug },
  });
  return permission;
};

//--------------------------Get Permission By Name---------------
module.exports.findById = async (id) => {
  const permission = await prisma.permission.findFirst({
    where: { id: id },
  });
  return permission;
};

// ----------------------------Create Permission--------------
module.exports.assignToUser = async (data) => {
  const PermissionData = await this.findById(data.permissionId);
  if (!PermissionData) {
    return false;
  }
  const permission = await prisma.usersOnPermissions.upsert({
    where: {
      userId_permissionId: {
        permissionId: data.permissionId,
        userId: data.userId
      }
    },
    update: {},
    create: {
      userId: data.userId,
      permissionId: data.permissionId
    }
  });
  return permission;
};
