import {Reflector} from "@nestjs/core";
import {Roles}     from "@prisma/client";

export const RolesGuardDecor = Reflector.createDecorator<keyof typeof Roles>();
