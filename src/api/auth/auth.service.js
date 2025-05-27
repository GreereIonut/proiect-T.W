const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

const registerUser = async (userData) => {
  const { username, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });
  return newUser;
};

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

module.exports = { registerUser, findUserByEmail };