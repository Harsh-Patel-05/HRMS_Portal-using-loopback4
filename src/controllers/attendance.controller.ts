import {
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  patch,
  del,
  requestBody,
} from '@loopback/rest';
import {AttendanceRepository, EmployeeRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {AttendanceService} from '../services';

export class AttendanceController {
  constructor(
    @service(AttendanceService)
    public attendanceService: AttendanceService
  ) { }

  @authenticate('jwt')
  @post('/attendances', {
    summary: 'Create attendances API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Cannot find employee'},
    },
  })
  async create(
    @requestBody({
      description: 'Create attendances API Endpoint',
      content: {
        'application/json': {
          schema: {
            required: ['empId', 'att_date', 'clock_in', 'clock_out'],
            properties: {
              empId: {type: 'string'},
              att_date: {type: 'string'},
              clock_in: {type: 'string'},
              clock_out: {type: 'string'},
            },
          },
        },
      },
    })
    payload: {
      empId: string;
      att_date: string;
      clock_in: string;
      clock_out: string;
    },
  ) {
    const result = await this.attendanceService.createAttendance(payload);

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Cannot find employee',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @get('/attendances/count', {
    summary: 'Count attendances API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async count() {
    const result = await this.attendanceService.countAttendances();

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @get('/attendances', {
    summary: 'List of attendances API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async find() {
    const result = await this.attendanceService.findAttendances();

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @get('/attendances/{id}', {
    summary: 'Get attendances by ID API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async findById(@param.path.string('id') id: string) {
    const result = await this.attendanceService.findAttendanceById(id);

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @patch('/attendances/{id}', {
    summary: 'Update attendances API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'Update attendances API Endpoint',
      content: {
        'application/json': {
          schema: {
            required: ['empId', 'att_date', 'clock_in', 'clock_out'],
            properties: {
              empId: {type: 'string'},
              att_date: {type: 'string'},
              clock_in: {type: 'string'},
              clock_out: {type: 'string'},
            },
          },
        },
      },
    })
    payload: {
      empId: string;
      att_date: string;
      clock_in: string;
      clock_out: string;
    },
  ) {
    const result = await this.attendanceService.updateAttendanceById(id, payload);

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @del('/attendances/{id}', {
    summary: 'Delete attendances API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async deleteById(@param.path.string('id') id: string) {
    const result = await this.attendanceService.deleteAttendanceById(id);

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return result;
  }
}
