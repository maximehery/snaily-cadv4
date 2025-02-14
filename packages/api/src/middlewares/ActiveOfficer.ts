import { Context, Middleware, Req, MiddlewareMethods } from "@tsed/common";
import { getSessionUser } from "../lib/auth";
import { getActiveOfficer } from "../lib/officer";

@Middleware()
export class ActiveOfficer implements MiddlewareMethods {
  async use(@Req() req: Req, @Context() ctx: Context) {
    const user = await getSessionUser(req);
    const officer = await getActiveOfficer(req, user.id, ctx);

    ctx.set("activeOfficer", officer);
  }
}
