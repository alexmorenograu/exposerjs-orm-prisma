import jwt from 'jsonwebtoken';
import UNAUTHORIZED from '../errors/unauthorized.js';
import bcrypt from 'bcrypt';

export default async (ctx, id, name, password) => {
    if (!id && !name) throw UNAUTHORIZED
    const config = global.CONFIG;
    const userData = await ctx.exposer.user.findFirst({
        include: {
            [config.roleModel.tableName]: true
        },
        where: {
            name,
        },
    });
    if (!userData?.id) throw UNAUTHORIZED;

    const valid = await bcrypt.compare(password, userData.password);
    if (!valid) throw UNAUTHORIZED

    const user = {
        id: userData.id,
        name: userData.name,
        role: userData[config.roleModel.tableName].name
    }
    const token = jwt.sign(user, global.CONFIG.tokenKey, { algorithm: 'HS256' });

    await ctx.exposer.usertoken.upsert({
        where: {
            userfk: userData.id
        },
        update: {
            token: token,
            created: new Date()
        },
        create: {
            userfk: userData.id,
            token: token
        }
    });

    return Object.assign(user, { token });
}