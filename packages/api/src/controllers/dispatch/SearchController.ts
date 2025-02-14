import { Controller, UseBeforeEach } from "@tsed/common";
import { Post } from "@tsed/schema";
import { NotFound } from "@tsed/exceptions";
import { BodyParams } from "@tsed/platform-params";
import { prisma } from "../../lib/prisma";
import { IsAuth, IsDispatch } from "../../middlewares";

@Controller("/search")
@UseBeforeEach(IsAuth, IsDispatch)
export class SearchController {
  @Post("/address")
  async searchAddress(@BodyParams("address") address: string) {
    const citizens = await prisma.citizen.findMany({
      where: {
        address: {
          contains: address,
        },
      },
      include: {
        warrants: true,
      },
    });

    if (citizens.length <= 0) {
      throw new NotFound("citizenNotFound");
    }

    return citizens;
  }
}
