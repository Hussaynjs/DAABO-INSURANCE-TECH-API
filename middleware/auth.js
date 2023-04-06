const {isTokenValid} = require('../utils')
const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const {attachCookiesToResponse} = require('../utils')
const Token = require('../models/Token')



// 
const auth = async(req, res, next) => {
    const {accessToken, refreshToken} = req.signedCookies;

    try {
        if(accessToken){
            const payload = isTokenValid(accessToken)
            console.log(payload.user);
            req.user = payload.user
            console.log(req.user);
            // req.user = payload.user
            // console.log(req.user);

            return next()
        }

        const payload = isTokenValid(refreshToken)

        const existingToken = await Token.findOne({
            user:payload.user.userId,
            refreshToken: payload.refreshToken
        })

        if(!existingToken || !existingToken?.isValid){
            throw new CustomError.UnauthenticatedError('unthenication invalid')
        }

        attachCookiesToResponse({
            res,
            user: payload.user,
            refreshToken: existingToken.refreshToken
        })
        req.user = payload.user
        next()

        
    } catch (error) {
        throw new CustomError.UnauthenticatedError('unthenication invalid')
    }
}
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        throw new CustomError.UnauthorizedError(
          'Unauthorized to access this route'
        );
      }
      next();
    };
  };

module.exports = {auth, authorizePermissions}