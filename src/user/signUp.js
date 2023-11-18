import jwt from 'jsonwebtoken';
import UNAUTHORIZED from '../errors/unauthorized.js';
import bcrypt from 'bcrypt';

export default async (ctx, name, password) => {
    if (!id && !name) throw UNAUTHORIZED
    const userData = await ctx.exposer.user.findUnique({
        where: {
            name,
        },
    });
    if (userData?.id) throw UNAUTHORIZED;

    let user;
    await ctx.exposer.$transaction(async (tx) => {
        const userData = await tx.user.create({
            data: {
                name,
                password: await bcrypt.hash(password, 10),
            }
        });

        user = {
            id: userData.id,
            name,
            role: global.CONFIG.userModel.defaultRoleId
        }

        const token = jwt.sign(user, global.CONFIG.tokenKey, { algorithm: 'HS256' });
        user.token = token;

        await tx.usertoken.create({
            data: {
                userfk: userData.id,
                token: token
            }
        });
    });

    delete user.password
    return Object.assign(user, { token });
}