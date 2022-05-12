import { buildSchemaSync, Resolver, Query } from "type-graphql";
import { ImageResolver } from "./image";
import { HouseResolver } from "./house";
import { authChecker } from "./auth";

@Resolver()
class DummyResolver {
  @Query(() => String)
  hello() {
    return "Hello resolver";
  }
}

export const schema = buildSchemaSync({
  resolvers: [DummyResolver, ImageResolver, HouseResolver],
  emitSchemaFile: process.env.NODE_ENV === "development",
  authChecker,
});
