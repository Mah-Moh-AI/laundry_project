const { Sequelize, bcrypt, crypto } = require("../utils/npmPackages");
const { DataTypes } = Sequelize;
const sequelize = require("../config/database");
const Branch = require("./branchModel");
const UserHistory = require("./userHistoryModel");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Set a default value using UUIDV4
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
      validate: {
        isEmail: {
          args: true,
          msg: "Please provide valid email format",
        },
      },
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [8, 255],
          msg: "Password Length should be between 8 and 255",
        },
      },
    },
    photo: {
      type: DataTypes.STRING,
      defaultValue: "default.jpg",
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "client",
      validate: {
        isIn: {
          args: [
            [
              "client",
              "laundry manager",
              "branch manager",
              "operator",
              "system admin",
            ],
          ],
          msg: "Invalid role",
        },
      },
    },
    branch: {
      type: DataTypes.UUID,
      references: {
        model: Branch,
        key: "id",
      },
    },
    mobileNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isNumeric: {
          args: true,
          msg: "The mobile number shall be numeric",
        },
        len: {
          args: [11, 11],
          msg: "Mobile Number Length should be 11 digits",
        },
      },
    },
    mobileNumberVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    passwordChangedAt: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lockUntil: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    invitationToken: DataTypes.STRING,
    mobileVerificationNumber: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    mobileVerificationNumberExpires: DataTypes.DATE,
  },
  {
    defaultScope: {
      attributes: {
        exclude: ["mobileVerificationNumber", "password"],
      },
    },
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "lastUpdatedAt",
    deletedAt: "deletedAt",
    paranoid: true, // for soft delete
    hooks: {
      // All hooks are added below
    },
    indexes: [
      {
        unique: true,
        fields: ["mobileNumber"],
      },
    ],
  }
);

// Define a scope for active
// --> in controller: activeTest = await Test.scope('active).findAll();
User.addScope("active", {
  where: {
    deletedAt: null,
  },
});

// Add Hooks

// password encryprion
User.addHook("beforeSave", async function (user) {
  if (!user.changed("password") || !user.password) return; // to be checked later
  user.password = await bcrypt.hash(user.password, 12);
});

// set password change time
User.addHook("beforeSave", async function (user) {
  // condition to run function in case password is modified and not new
  if (user.changed("password") && !user.isNewRecord) {
    // set time stamp for password change
    user.passwordChangedAt = new Date();
  }
});

User.addHook("beforeFind", function (options) {
  console.log("Applied Scopes:", options.attributes, options.include);
  options.include = [
    {
      model: Branch,
      as: "branchIdFk",
      attributes: ["id", "name"],
    },
  ];
  return options;
});

// document functions
User.prototype.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  console.log(candidatePassword);
  console.log(userPassword);
  return await bcrypt.compare(candidatePassword, userPassword);
};

User.prototype.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedAtTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < passwordChangedAtTimeStamp;
  }
  return false;
};

User.prototype.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 60 * 1000;
  return resetToken;
};

User.prototype.createVerificationToken = async function () {
  const invitationToken = crypto.randomBytes(32).toString("hex");
  this.invitationToken = crypto
    .createHash("sha256")
    .update(invitationToken)
    .digest("hex");
  await this.save();
  console.log("Test1", this.invitationToken);
  return invitationToken; // to be changed later in Model to verificationToken
};

User.prototype.deleteToken = async function () {
  this.invitationToken = null;
  await this.save();
};

User.prototype.verifyEmail = async function () {
  this.emailVerified = true;
  await this.save();
};

User.addHook("beforeUpdate", async (user, options) => {
  const changedAttributes = user.changed();
  const previousData = user.previous();
  let historyData;
  // in case of soft delete
  if (changedAttributes.includes("deletedAt")) {
    historyData = {
      userId: user.id,
      action: "delete",
      previousData: previousData,
      timestamp: new Date(),
    };
  } else {
    // in case of update
    historyData = {
      userId: user.id,
      action: "update",
      changes: changedAttributes,
      previousData: previousData,
      timestamp: new Date(),
    };
  }
  await UserHistory.create(historyData);
});

User.addHook("beforeDestroy", async (user, options) => {
  const previousData = user.previous();

  const historyData = {
    userId: user.id,
    action: "delete",
    previousData: previousData,
    timestamp: new Date(),
  };

  await UserHistory.create(historyData);
});

// Define associations
// User.belongsTo(Branch, { foreignKey: "branch", as: "branchIdFk" });

// The below is for reference but not used --> this another way to create a FK
// User.belongsTo(Vacation, {
//   through: "UserVacation",
//   foreignKey: "userId",
//   otherKey: "vacationId",
//   as: "vacations",
//   constraints: false,
// });

module.exports = User;
