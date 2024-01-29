import {Entity, belongsTo, hasOne, model, property} from '@loopback/repository';
import {Organization} from './organization.model';
import {DateTime} from 'luxon';
import {Employee} from './employee.model';

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class Department extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id: string;

  @belongsTo(
    () => Organization,
    {
      //relation metadata
      name: 'organization',
    },
    {
      // property definition
      type: 'string',
      required: true,
      mongodb: {dataType: 'ObjectId'},
    },
  )
  orgId: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

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

  @hasOne(() => Employee)
  employee: Employee;

  constructor(data?: Partial<Department>) {
    super(data);
  }
}

export interface DepartmentRelations {
  // describe navigational properties here
}

export type DepartmentWithRelations = Department & DepartmentRelations;
