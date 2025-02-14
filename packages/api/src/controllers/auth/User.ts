import { Context, Res, BodyParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { UseBefore } from "@tsed/platform-middlewares";
import { Delete, JsonRequestBody, Patch, Post } from "@tsed/schema";
import { Cookie } from "@snailycad/config";
import { prisma } from "../../lib/prisma";
import { IsAuth } from "../../middlewares/IsAuth";
import { setCookie } from "../../utils/setCookie";
import { User } from ".prisma/client";
import { BadRequest, NotFound } from "@tsed/exceptions";
import { CHANGE_PASSWORD_SCHEMA, validate } from "@snailycad/schemas";
import { compareSync, genSaltSync, hashSync } from "bcrypt";

@Controller("/user")
@UseBefore(IsAuth)
export class AccountController {
  @Post("/")
  async getAuthUser(@Context() ctx: Context) {
    return { ...ctx.get("user"), cad: ctx.get("cad") ?? null };
  }

  @Patch("/")
  async patchAuthUser(@BodyParams() body: JsonRequestBody, @Context("user") user: User) {
    const { username, isDarkTheme } = body.toJSON();

    const existing = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existing && user.username !== username) {
      throw new BadRequest("userAlreadyExists");
    }

    const updated = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username,
        isDarkTheme,
      },
    });

    return updated;
  }

  @Delete("/")
  async deleteAuthUser(@Context() ctx: Context) {
    await prisma.user.delete({
      where: {
        id: ctx.get("user").id,
      },
    });
  }

  @Post("/logout")
  async logoutUser(@Res() res: Res, @Context() ctx: Context) {
    ctx.delete("user");

    setCookie({
      res,
      name: Cookie.Session,
      expires: 0,
      value: "",
    });

    return true;
  }

  @Post("/password")
  async updatePassword(@Context("user") user: User, @BodyParams() body: JsonRequestBody) {
    const error = validate(CHANGE_PASSWORD_SCHEMA, body.toJSON(), true);
    if (error) {
      throw new BadRequest(error);
    }

    const u = await prisma.user.findUnique({ where: { id: user.id } });

    if (!u) {
      throw new NotFound("notFound");
    }

    const { currentPassword, newPassword, confirmPassword } = body.toJSON();
    if (confirmPassword !== newPassword) {
      throw new BadRequest("passwordsDoNotMatch");
    }

    const isCurrentPasswordCorrect = compareSync(currentPassword, u.password);
    if (!isCurrentPasswordCorrect) {
      throw new BadRequest("currentPasswordIncorrect");
    }

    const salt = genSaltSync();
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashSync(newPassword, salt),
      },
    });

    return true;
  }
}
