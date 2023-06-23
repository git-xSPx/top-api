import { Injectable } from '@nestjs/common';
import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';
import { TopPageService } from '../top-page.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class UniqueAliasValidator implements ValidatorConstraintInterface {
    constructor(private readonly topPageService: TopPageService) {}

    async validate(alias: string, args: ValidationArguments): Promise<boolean> {
        const topPage = await this.topPageService.findByAlias(alias);
        return !topPage;
    }

    defaultMessage(args: ValidationArguments): string {
        return `Alias "${args.value}" already exists. Please choose a different alias.`;
    }
}

export function IsUniqueAlias(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isUniqueAlias',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: UniqueAliasValidator,
            async: true,
        });
    };
}
