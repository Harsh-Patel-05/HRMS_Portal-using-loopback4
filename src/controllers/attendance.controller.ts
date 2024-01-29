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

export class AttendanceController {
  constructor(
    @repository(AttendanceRepository)
    public attendanceRepository: AttendanceRepository,
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
  ) { }

  // @authenticate('jwt')
  @post('/attendances', {
    summary: 'Create attendances API Endpoint',
    responses: {
      '200': {},
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
              empId: {
                type: 'string',
              },
              att_date: {
                type: 'string',
              },
              clock_in: {
                type: 'string',
              },
              clock_out: {
                type: 'string',
              },
            }
          }
        },
      },
    })
    payload: {
      empId: 'string',
      att_date: 'string',
      clock_in: 'string',
      clock_out: 'string',
    }
  ) {
    const employee = await this.employeeRepository.findOne({
      where: {
        id: payload.empId,
        isDeleted: false,
      }
    });

    if (employee) {
      const result = await this.attendanceRepository.create(payload);
      return {
        statusCode: 200,
        message: 'created successfully',
        result
      }
    } else {
      return {
        statusCode: 404,
        message: 'can not found department',
      }
    }
  }

  // @authenticate('jwt')
  @get('/attendances/count', {
    summary: 'Count attendances API Endpoint',
    responses: {
      '200': {},
    },
  })
  async count() {
    const data = await this.attendanceRepository.find({
      where: {
        isDeleted: false,
      }
    });

    if (!data) {
      return {
        statusCode: 404,
        message: 'data not found'
      }
    }

    const count = data.length;
    return {
      statusCode: 200,
      message: 'success',
      count
    }
  }

  // @authenticate('jwt')
  @get('/attendances', {
    summary: 'List of attendances API Endpoint',
    responses: {
      '200': {}
    }
  })
  async find() {
    const data = await this.attendanceRepository.find({
      where: {
        isDeleted: false
      }
    });

    if (!data[0]) {
      return {
        statusCode: 404,
        message: 'Data not found'
      }
    }

    return {
      statusCode: 200,
      message: 'success',
      data
    }
  }

  // @authenticate('jwt')
  @get('/attendances/{id}', {
    summary: 'Get attendances by Id API Endpoint',
    responses: {
      '200': {}
    }
  })
  async findById(
    @param.path.string('id') id: string,
  ) {
    const data = await this.attendanceRepository.findOne({
      where: {
        id,
        isDeleted: false
      }
    });

    if (!data) {
      return {
        statusCode: 404,
        message: 'data not found'
      }
    }

    return {
      statusCode: 200,
      message: 'success',
      data
    }
  }

  // @authenticate('jwt')
  @patch('/attendances/{id}', {
    summary: 'Update attendances API Endpoint',
    responses: {
      '200': {}
    }
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'Update attendances API Endpoint',
      content: {
        'application/json': {
          schema: {
            // required: ['empId', 'att_date', 'clock_in', 'clock_out'],
            properties: {
              empId: {
                type: 'string',
              },
              att_date: {
                type: 'string',
              },
              clock_in: {
                type: 'string',
              },
              clock_out: {
                type: 'string',
              },
            }
          }
        },
      },
    })
    payload: {
      empId: 'string',
      att_date: 'string',
      clock_in: 'string',
      clock_out: 'string',
    }
  ) {
    const data = await this.attendanceRepository.findOne({
      where: {
        id,
        isDeleted: false,
      }
    })
    if (!data) {
      return {
        statusCode: 404,
        message: 'data not found'
      }
    }

    const result = await this.attendanceRepository.updateById(data.id, payload);
    return {
      statusCode: 200,
      message: 'success',
      result
    }
  }

  // @authenticate('jwt')
  @del('/attendances/{id}', {
    summary: 'Delete attendances API Endpoint',
    responses: {
      '200': {},
    },
  })
  async deleteById(@param.path.string('id') id: string) {
    const data = await this.attendanceRepository.findOne({
      where: {
        id,
        isDeleted: false
      }
    })

    if (data) {
      const result = await this.attendanceRepository.updateById(data.id, {
        isDeleted: true
      });
      return {
        statusCode: 200,
        message: 'success',
        result
      }
    } else {
      return {
        statusCode: 404,
        message: 'Attendances data already deleted'
      }
    }
  }
}
