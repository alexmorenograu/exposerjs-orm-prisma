import schematizer from './src/schematizer.js';
import getAcls from './src/getAcls.js';
import signIn from './src/user/signIn.js';
import signUp from './src/user/signUp.js';
import tokenVerify from './src/user/tokenVerify.js';

export function exporter(prismaClient) {
    const prismaInstance = new prismaClient();
    return {
        models: prismaInstance,
        runtimeModels: prismaInstance._runtimeDataModel.models,
        schematizer,
        getAcls,
        user: {
            signIn,
            signUp,
            tokenVerify
        }
    }
}
