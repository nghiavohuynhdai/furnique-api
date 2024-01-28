import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, isValidObjectId } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { OrderStatus, TransactionStatus } from '@common/contracts/constant'
import { IsEmail, IsMongoId, IsNotEmpty, IsPhoneNumber, MaxLength, Min, ValidateNested } from 'class-validator'
import { Product } from '@product/schemas/product.schema'

export class CustomerOrderDto {
  _id?: string

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(30)
  firstName: string

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(30)
  lastName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone: string

  @ApiProperty()
  @Prop({ type: String, required: true })
  shippingAddress: string
}

export class ItemOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  product: Product

  @ApiProperty()
  @IsNotEmpty()
  @Min(1)
  quantity: number
}

export type OrderDocument = HydratedDocument<Order>

@Schema({
  collection: 'orders',
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.__v
    }
  }
})
export class Order {
  constructor(id?: string) {
    this._id = id
  }

  @ApiProperty()
  @Transform(({ value }) => value?.toString())
  _id: string

  @ApiProperty()
  @Prop({ type: CustomerOrderDto, required: true })
  customer: CustomerOrderDto;

  @ApiProperty({ isArray: true, type: ItemOrderDto })
  @ValidateNested()
  @Prop({ type: Array<ItemOrderDto>, required: true })
  items: ItemOrderDto[]

  @ApiProperty()
  @Prop({ type: Number, required: true })
  totalAmount: number

  @ApiProperty()
  @Prop({ type: Date, required: true, default: new Date() })
  orderDate: Date

  @ApiProperty()
  @Prop({
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  orderStatus: OrderStatus

  @ApiProperty()
  @Prop({
    enum: TransactionStatus,
    default: TransactionStatus.DRAFT
  })
  transactionStatus: TransactionStatus

  @ApiProperty()
  @Prop({ type: Date })
  deliveryDate: Date

  @ApiProperty()
  @Prop({ type: Date })
  completeDate: Date

  @ApiPropertyOptional()
  @Prop({ type: String })
  notes?: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)

OrderSchema.plugin(paginate)