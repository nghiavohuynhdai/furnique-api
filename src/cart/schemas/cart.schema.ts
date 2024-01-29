import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types, isValidObjectId } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { Status } from '@common/contracts/constant'
import { IsMongoId, IsNotEmpty, Min, ValidateNested } from 'class-validator'
import { Variant } from '@src/product/schemas/product.schema'

export class ItemDto {
  @Prop({ type: Types.ObjectId, ref: 'Product' })
  @ApiProperty({ example: 'productId' })
  @IsNotEmpty()
  @IsMongoId()
  productId: Types.ObjectId

  @Prop()
  @ApiProperty({ example: 'EF20241212' })
  sku: string

  @Prop()
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Min(1)
  quantity: number
}

export type CartDocument = HydratedDocument<Cart>

@Schema({
  collection: 'carts',
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.__v
    }
  }
})
export class Cart {
  constructor(id?: string) {
    this._id = id
  }

  @ApiProperty()
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true })
  customerId: string

  @ApiProperty({ isArray: true, type: ItemDto })
  @ValidateNested()
  @Prop({ type: Array<ItemDto>, required: true })
  items: ItemDto[]

  @ApiProperty()
  @Prop({ type: Number, required: true })
  totalAmount: number

  @Prop({
    enum: Status,
    default: Status.ACTIVE
  })
  status: Status
}

export const CartSchema = SchemaFactory.createForClass(Cart)

CartSchema.plugin(paginate)

CartSchema.virtual('items.product', {
  ref: 'Product',
  localField: 'items.productId',
  foreignField: '_id',
  justOne: true
})
