class UserDto {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.mobileNumber = user.mobileNumber;
    this.email = user.email;
    this.photo = user.photo || null;
    this.role = user.role;
    this.branch = user.branch;
    this.branchIdFk = user.branchIdFk;
    this.clientIdFk = user.clientIdFk;
    this.operatorIdFk = user.operatorIdFk;
  }
}

module.exports = UserDto;
