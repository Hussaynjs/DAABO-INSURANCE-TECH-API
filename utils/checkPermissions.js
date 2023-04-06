const customError = require('../errors')


const checkPermissions = (requestUser, resourceId) => {
    // console.log(requestUser);
    // console.log(resourceId);

    if(requestUser.role === 'admin') return;

    if(requestUser.userId === resourceId.toString()) return;

    throw new customError.UnauthorizedError('unAuthourize to access this route')
}


module.exports = checkPermissions