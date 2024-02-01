import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  del,
  get,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {EmployeeService} from '../services';

export class EmployeeController {
  constructor(
    @service(EmployeeService)
    public employeeService: EmployeeService
  ) { }

  @authenticate('jwt')
  @post('/employees', {
    summary: 'Create employees API Endpoint',
    responses: {
      '200': {},
      '400': {description: 'Cannot find department'},
    },
  })
  async create(
    @requestBody({
      description: 'Create employees API Endpoint',
      content: {
        'application/json': {
          schema: {
            required: ['depId', 'firstName', 'lastName', 'email', 'phone', 'hire_date', 'salary'],
            properties: {
              depId: {
                type: 'string',
              },
              firstName: {
                type: 'string',
              },
              lastName: {
                type: 'string',
              },
              email: {
                type: 'string',
                format: 'email',
                maxLength: 254,
                minLength: 5,
              },
              phone: {
                type: 'number',
              },
              hire_date: {
                type: 'string',
              },
              salary: {
                type: 'number',
              },
            }
          }
        },
      },
    })
    payload: {
      depId: 'string',
      firstName: 'string',
      lastName: 'string',
      email: 'string',
      phone: number,
      hire_date: 'string',
      salary: number,
    }
  ) {
    const result = await this.employeeService.createEmployee(payload);

    if (result.statusCode === 400) {
      throw {
        statusCode: 400,
        message: 'Cannot find department',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @get('/employees/count', {
    summary: 'Count employees API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async count() {
    const result = await this.employeeService.countEmployee();

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @get('/employees', {
    summary: 'List of employees API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async find() {
    const result = await this.employeeService.findEmployee();

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @get('/employees/{id}', {
    summary: 'Get employees by ID API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Employee not found'},
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ) {
    const data = await this.employeeService.findEmployeeById(id);

    if (!data) {
      throw {
        statusCode: 404,
        message: 'Employee not found',
      };
    }

    return {
      statusCode: 200,
      message: 'success',
      data,
    };
  }

  @authenticate('jwt')
  @patch('/employees/{id}', {
    summary: 'Update employees API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'Update employees API Endpoint',
      content: {
        'application/json': {
          schema: {
            properties: {
              depId: {
                type: 'string',
              },
              firstName: {
                type: 'string',
              },
              lastName: {
                type: 'string',
              },
              email: {
                type: 'string',
                format: 'email',
                maxLength: 254,
                minLength: 5,
              },
              phone: {
                type: 'number',
              },
              hire_date: {
                type: 'string',
              },
              salary: {
                type: 'number',
              },
            }
          }
        },
      },
    })
    payload: {
      depId?: 'string',
      firstName?: 'string',
      lastName?: 'string',
      email?: 'string',
      phone?: number,
      hire_date?: 'string',
      salary?: number,
    }) {
    const result = await this.employeeService.updateEmployeeById(id, payload);

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @del('/employees/{id}', {
    summary: 'Delete employees API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found or already deleted'},
    },
  })
  async deleteById(@param.path.string('id') id: string) {
    const result = await this.employeeService.deleteEmployeeById(id);

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found or already deleted',
      };
    }

    return result;
  }
}
