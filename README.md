# Prisma implementation for ExposerJS

Supports ExposerJS for Prisma ORM. Included by default

## Funcionality

```js
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
      tokenVerify,
    },
  };
}
```
