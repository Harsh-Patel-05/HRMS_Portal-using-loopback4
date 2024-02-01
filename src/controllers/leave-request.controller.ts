import {
  del,
  get,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {LeaveRequestService} from '../services';

export class LeaveRequestController {
  constructor(
    @service(LeaveRequestService)
    public leaveRequestService: LeaveRequestService
  ) { }

  @authenticate('jwt')
  @post('/leave-requests', {
    summary: 'Create leave-requests API Endpoint',
    responses: {
      '200': {},
      '404': {
        description: 'Employee not found',
      },
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
              empId: {type: 'string'},
              start_date: {type: 'string'},
              end_date: {type: 'string'},
              leave_type: {type: 'string'},
            },
          },
        },
      },
    })
    payload: {
      empId: string;
      start_date: string;
      end_date: string;
      leave_type: string;
    },
  ) {
    const result = await this.leaveRequestService.createLeaveRequest(payload);

    if (result.statusCode === 400) {
      throw {
        statusCode: 400,
        message: 'Employee not found',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @get('/leave-requests/count', {
    summary: 'Count leave requests API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async count() {
    const result = await this.leaveRequestService.countLeaveRequest();

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @get('/leave-requests', {
    summary: 'List of leave-requests API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async find() {
    const result = await this.leaveRequestService.findLeaveRequest();

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @get('/leave-requests/{id}', {
    summary: 'Get leave-requests by ID API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Employee not found'},
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ) {
    const data = await this.leaveRequestService.findLeaveRequestById(id);

    if (!data) {
      throw {
        statusCode: 404,
        message: 'LeaveRequest not found',
      };
    }

    return {
      statusCode: 200,
      message: 'success',
      data,
    };
  }

  @authenticate('jwt')
  @patch('/leave-requests/{id}', {
    summary: 'Update leave-requests API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'Update leave-requests API Endpoint',
      content: {
        'application/json': {
          schema: {
            properties: {
              empId: {type: 'string'},
              start_date: {type: 'string'},
              end_date: {type: 'string'},
              leave_type: {type: 'string'},
            },
          }
        },
      },
    })
    payload: {
      empId: string;
      start_date: string;
      end_date: string;
      leave_type: string;
    }) {
    const result = await this.leaveRequestService.updateLeaveRequestById(id, payload);

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @del('/leave-requests/{id}', {
    summary: 'Delete leave-requests API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found or already deleted'},
    },
  })
  async deleteById(@param.path.string('id') id: string) {
    const result = await this.leaveRequestService.deleteLeaveRequestById(id);

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found or already deleted',
      };
    }

    return result;
  }
}
