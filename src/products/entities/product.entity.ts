import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { User } from "../../auth/entities/user.entity";
import { ProductImage } from './product-image.entity';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({ 
        example: '23ee74f5-e8f2-4dff-a877-48e91b89520a',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ 
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({ 
        example: '99.99',
        description: 'Product Price',
        default: 0,
        required: false,
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({ 
        example: 'Aliquip tempor consectetur ex id et do anim fugiat occaecat.',
        description: 'Product Description',
        required: false
    })
    @Column('text', {
        nullable: true
    })
    description: string;

    @ApiProperty({ 
        example: 'T_Shirt_Teslo',
        description: 'Product Slug',
        uniqueItems: true,
        required: false
    })
    @Column('text', {
        unique: true
    })
    slug: string

    @ApiProperty({ 
        example: 10,
        description: 'Product stock',
        default: 0,
        required: false,
    })
    @Column('int', {
        default: 0
    })
    stock: number

    @ApiProperty({ 
        example: ['XS', 'XL'],
        description: 'Product Sizes',
        isArray: true,
    })
    @Column('text', {
        array: true
    })
    sizes: string[]

    @ApiProperty({ 
        example: 'kid',
        description: 'Product gender',
        enum: ['men', 'women', 'kid', 'unisex'],
        required: false,
    })
    @Column('text')
    gender: string;

    @ApiProperty({ 
        example: [],
        description: 'Product tags',
        isArray: true,
        required: false,
    })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    @ApiProperty({ 
        example: ['1473809-00-A_1_2000', '1473824-00-A_2_2000'],
        description: 'Product images',
        isArray: true,
        required: false,
    })
    @OneToMany(
        () => ProductImage,
        productImage => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[]

    @ManyToOne(
        () => User,
        user => user.product,
    )
    user: User

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug)
            this.slug = this.title;

        this.slug = this.slug.toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug.toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }
}
