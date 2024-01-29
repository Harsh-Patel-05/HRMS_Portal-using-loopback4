import {
  repository,
} from '@loopback/repository';
import {
  del,
  get,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {EmployeeRepository, LeaveRequestRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class LeaveRequestController {
  constructor(
    @repository(LeaveRequestRepository)
    public leaveRequestRepository: LeaveRequestRepository,
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
  ) { }

  @authenticate('jwt')
  @post('/leave-requests', {
    summary: 'Create leave-requests API Endpoint',
    responses: {
      '200': {},
    },
  })
  async create(
    @requestBody({
      description: 'Create leave-requests API Endpoint',
      content: {
        'application/json': {
          schema: {
            required: ['empId', 'start_date', 'end_date', 'leave_type'],
            properties: {
              empId: {
                type: 'string',
              },
              start_date: {
                type: 'string',
              },
              end_date: {
                type: 'string',
              },
              leave_type: {
                type: 'string',
              },
            }
          }
        },
      },
    })
    payload: {
      empId: 'string',
      start_date: 'string',
      end_date: 'string',
      leave_type: 'string',
    }) {
    const employee = await this.employeeRepository.findOne({
      where: {
        id: payload.empId,
        isDeleted: false,
      }
    })
    if (employee) {
      const data = await this.leaveRequestRepository.create(payload);
      return {
        statusCode: 200,
        message: 'created successfully',
        data
      }
    } else {
      return {
        statusCode: 404,
        message: 'can not found department'
      }
    }
  }

  @authenticate('jwt')
  @get('/leave-requests/count', {
    summary: 'Count leave-requests API Endpoint',
    responses: {
      '200': {},
    },
  })
  async count() {
    const data = await this.leaveRequestRepository.find({
      where: {
        isDeleted: false
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

  @authenticate('jwt')
  @get('/leave-requests', {
    summary: 'List of leave-requests API Endpoint',
    responses: {
      '200': {}
    }
  })
  async find() {
    const data = await this.leaveRequestRepository.find({
      where: {
        isDeleted: false
      }
    });

    if (!data[0]) {
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

  @authenticate('jwt')
  @get('/leave-requests/{id}', {
    summary: 'Get leave-requests by Id API Endpoint',
    responses: {
      '200': {}
    }
  })
  async findById(
    @param.path.string('id') id: string,
  ) {
    const data = await this.leaveRequestRepository.findOne({
      where: {
        id,
        isDeleted: false,
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

  @authenticate('jwt')
  @patch('/leave-requests/{id}', {
    summary: 'Update leave-requests API Endpoint',
    responses: {
      '200': {}
    }
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'Update leave-requests API Endpoint',
      content: {
        'application/json': {
          schema: {
            // required: ['empId', 'start_date', 'end_date', 'leave_type'],
            properties: {
              empId: {
                type: 'string',
              },
              start_date: {
                type: 'string',
              },
              end_date: {
                type: 'string',
              },
              leave_type: {
                type: 'string',
              },
            }
          }
        },
      },
    })
    payload: {
      empId: 'string',
      start_date: 'string',
      end_date: 'string',
      leave_type: 'string',
    }
  ) {
    const data = await this.leaveRequestRepository.findOne({
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

    const result = await this.leaveRequestRepository.updateById(data.id, payload);
    return {
      statusCode: 200,
      message: 'success',
      result
    }
  }

  @authenticate('jwt')
  @del('/leave-requests/{id}', {
    summary: 'Delete leave-requests API Endpoint',
    responses: {
      '200': {},
    },
  })
  async deleteById(@param.path.string('id') id: string) {
    const data = await this.leaveRequestRepository.findOne({
      where: {
        id,
        isDeleted: false
      }
    })

    if (data) {
      const result = await this.leaveRequestRepository.updateById(id, {
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
        message: 'Leave-requests data already deleted'
      }
    }
  }
}
