import {Entity, Model, hasOne, model, property} from '@loopback/repository';
import {DateTime} from 'luxon';

//Address model
@model({forceId: false})
export class Address extends Model {
  @property({
    type: 'string',
    default: null,
  })
  city?: string | null;

  @property({
    type: 'string',
    default: null,
  })
  state?: string | null;

  @property({
    type: 'string',
    default: null,
  })
  zipcode?: string | null;

  constructor(data?: Partial<Address>) {
    super(data);
  }
}

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class Organization extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  org_name: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      format: 'email',
      transform: ['trim'],
      maxLength: 254,
      minLength: 5,
      pattern: '^(?! ).*[^ ]$',
      errorMessage: {
        pattern: `Invalid input.`,
      },
    },
  })
  email: string;

  @property({
    type: 'number',
    required: true,
  })
  phone: number;

  @property({
    type: 'string',
    required: true,
  })
  website: string;

  @property({
    type: Address,
    default: {},
  })
  Address?: Address;

  @property({
    type: 'boolean',
    default: false,
  })
  isDeleted?: boolean;

  @property({
    type: 'date',
    default: () => DateTime.utc().toJSDate(),
  })
  createdAt?: DateTime;

  @property({
    type: 'date',
    default: () => DateTime.utc().toJSDate(),
  })
  updatedAt?: DateTime;

  @hasOne(() => Organization)
  organization: Organization;

  constructor(data?: Partial<Organization>) {
    super(data);
  }
}

export interface OrganizationRelations {
  // describe navigational properties here
}

export type OrganizationWithRelations = Organization & OrganizationRelations;
