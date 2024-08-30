import { PermissionGroup } from "@prisma/client";
import { Type } from "class-transformer";
import {
    IsArray,
    IsIn,
    IsInt,
    IsNumber,
    IsString,
    ValidateNested,
} from "class-validator";

export class PermissionDto {
    @IsInt()
    id: number;

    @IsString()
    @IsIn(Object.keys(PermissionGroup))
    group: PermissionGroup;

    @IsString()
    name: string;

    @IsString()
    description: string;
}

export class PermissionResponseDto extends PermissionDto {
    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}

export class RolePermissionDto {
    @IsNumber()
    roleId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PermissionDto)
    permissionMatrix: PermissionDto[];
}
