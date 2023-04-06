const createTokenUser = (user) => {
    return {name:user.firstName, userId: user._id, accountType:user.accountType}
}

module.exports = createTokenUser