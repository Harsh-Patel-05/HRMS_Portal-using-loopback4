import {Entity, belongsTo, hasOne, model, property} from '@loopback/repository';
import {Department} from './department.model';
import {DateTime} from 'luxon';
import {LeaveRequest} from './leave-request.model';
import {Attendance} from './attendance.model';

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class Employee extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id: string;

  @belongsTo(
    () => Department,
    {
      //relation metadata
      name: 'department',
    },
    {
      // property definition
      type: 'string',
      required: true,
      mongodb: {dataType: 'ObjectId'},
    },
  )
  depId: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

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
  hire_date: string;

  @property({
    type: 'number',
    required: true,
  })
  salary: number;

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

  @hasOne(() => LeaveRequest)
  leaveRequest: LeaveRequest;

  @hasOne(() => Attendance)
  attendance: Attendance;


  constructor(data?: Partial<Employee>) {
    super(data);
  }
}

export interface EmployeeRelations {
  // describe navigational properties here
}

export type EmployeeWithRelations = Employee & EmployeeRelations;
