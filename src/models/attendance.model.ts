import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Employee} from './employee.model';
import {DateTime} from 'luxon';

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class Attendance extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id: string;

  @belongsTo(
    () => Employee,
    {
      //relation metadata
      name: 'employee',
    },
    {
      // property definition
      type: 'string',
      required: true,
      mongodb: {dataType: 'ObjectId'},
    },
  )
  empId: string;

  @property({
    type: 'string',
    required: true,
  })
  att_date: string;

  @property({
    type: 'string',
    required: true,
  })
  clock_in: string;

  @property({
    type: 'string',
    required: true,
  })
  clock_out: string;

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

  constructor(data?: Partial<Attendance>) {
    super(data);
  }
}

export interface AttendanceRelations {
  // describe navigational properties here
}

export type AttendanceWithRelations = Attendance & AttendanceRelations;
