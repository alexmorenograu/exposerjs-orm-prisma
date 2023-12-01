export default async (ctx, config) => ctx.exposer[config.aclModel.tableName].findMany({
    include: {
        [config.roleModel.tableName]: true
    }
});
