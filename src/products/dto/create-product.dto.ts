import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateProductDto {
    
    @ApiProperty({ 
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        nullable: false,
        minLength: 1,
        uniqueItems: true
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({ 
        example: '99.99',
        description: 'Product Price',
        default: 0,
        required: false,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({ 
        example: 'Aliquip tempor consectetur ex id et do anim fugiat occaecat.',
        description: 'Product Description',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ 
        example: 'T_Shirt_Teslo',
        description: 'Product Slug',
        uniqueItems: true,
        required: false
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({ 
        example: 10,
        description: 'Product stock',
        default: 0,
        required: false,
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({ 
        example: ['XS', 'XL'],
        description: 'Product Sizes',
        isArray: true,
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty({ 
        example: 'kid',
        description: 'Product gender',
        enum: ['men', 'women', 'kid', 'unisex'],
        required: true,
    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({ 
        example: [],
        description: 'Product tags',
        isArray: true,
        required: false,
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty({ 
        example: ['1473809-00-A_1_2000', '1473824-00-A_2_2000'],
        description: 'Product images',
        isArray: true,
        required: false,
    })
    @IsString({each: true})
    @IsArray()
    @IsOptional()
    images?: string[];
}
