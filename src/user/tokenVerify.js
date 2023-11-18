import jwt from 'jsonwebtoken';
import UNAUTHORIZED from '../errors/unauthorized.js';

export default async (ctx, token) => {
    if (!token) throw UNAUTHORIZED
    const tokenData = jwt.verify(token, global.CONFIG.tokenKey, { algorithm: 'HS256' })

    if (!tokenData.id) throw UNAUTHORIZED

    const userData = await ctx.exposer.user.findUnique({
        select: {
            id: true,
        },
        where: {
            id: tokenData.id
        }
    });

    if (!userData.id) throw UNAUTHORIZED

    const userToken = await ctx.exposer.usertoken.findUnique({
        where: {
            userfk: tokenData.id
        }
    });
    if (userToken.token != token) throw UNAUTHORIZED
    return tokenData
}