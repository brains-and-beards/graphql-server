const APP_SECRET = 'abcdefghijklmnopqrst';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

signUp = async (_object, args, context, _information) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.db.mutation.createUser(
    {
      data: { ...args, password }
    },
    `{ id }`
  );

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
};

login = async (_object, args, context, _information) => {
  const user = await context.db.query.user(
    { where: { email: args.email } },
    ` { id password } `
  );
  if (!user) {
    throw new Error('User not found');
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Sorry, Wrong password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
};

dog = (root, args, context, queryInfo) => {
  return context.db.mutation.createDog(
    {
      data: {
        type: args.type,
        name: args.name
      }
    },
    queryInfo
  );
};

module.exports = {
  signUp,
  login,
  dog
};
