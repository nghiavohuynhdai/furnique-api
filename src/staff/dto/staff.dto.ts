import { ApiProperty } from '@nestjs/swagger'
import { DataResponse, PaginateResponse } from '@src/common/contracts/openapi-builder'
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsUrl, MaxLength } from 'class-validator'
import { StaffRole } from '@src/common/contracts/constant'
import { Staff } from '@staff/schemas/staff.schema'

export class CreateStaffDto {
    @ApiProperty({ example: 'Staff'})
    @IsNotEmpty()
    @MaxLength(30)
    firstName: string
  
    @ApiProperty({ example: 'Name' })
    @IsNotEmpty()
    @MaxLength(30)
    lastName: string

    @ApiProperty({ example: 'EF123456' })
    @IsNotEmpty()
    @MaxLength(30)
    staffCode: string

    @ApiProperty({ example: '0987654321' })
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string

    @ApiProperty({ example: 'https://i.stack.imgur.com/l60Hf.png' })
    @IsNotEmpty()
    @IsUrl()
    avatar: string
  
    @ApiProperty({ example: 'staff@gmail.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({ example: 'STAFF | DELIVERY_STAFF | CONSULTANT_STAFF' })
    @IsNotEmpty()
    @IsEnum(StaffRole)
    role: StaffRole

    password?: string
    providerId?: string
    createdBy?: string
  }

export class StaffPaginateResponseDto extends DataResponse(
  class StaffPaginateResponse extends PaginateResponse(Staff) {}
) {}

export class StaffResponseDto extends DataResponse(Staff) {}