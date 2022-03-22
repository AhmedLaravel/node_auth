const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//----------------------helper function to check if the user has the permission ---------------
module.exports.hasPermissionTo = async (userId, slug) => {
  const userPermissions = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      permissions: {
        where: {
          permission: {
            slug: slug,
          },
        },
        select: {
          permission: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });
  if (userPermissions.permissions.length) {
    return true;
  }

  const userRolePermissions = await prisma.role.findFirst({
    where: {
      users: {
        some: {
          userId: userId,
        },
      },
      permissions: {
        some: {
          permission: {
            slug: slug,
          },
        },
      },
    },
    select: {
      permissions: {
        select: {
          permission: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });
  if (userRolePermissions) {
    return true;
  }
  return false;
};

module.exports.hasRole = async (userId, slug) => {
  const userRole = await prisma.role.findFirst({
    where: {
      users: {
        some: {
          userId: userId,
        },
      },
      slug: slug,
    },
    select: {
      slug: true,
    },
  });
  console.log(userRole);
  if (!userRole) {
    return false;
  }
  return true;
};
