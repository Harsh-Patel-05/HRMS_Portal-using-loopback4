import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  del,
  get,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {DepartmentService} from '../services';

export class DepartmentController {
  constructor(
    @service(DepartmentService)
    public departmentService: DepartmentService
  ) { }

  @authenticate('jwt')
  @post('/departments', {
    summary: 'Create departments API Endpoint',
    responses: {
      '200': {},
      '400': {description: 'Cannot find organization'},
    },
  })
  async create(
    @requestBody({
      description: 'Create departments API Endpoint',
      content: {
        'application/json': {
          schema: {
            required: ['name'],
            properties: {
              name: {
                type: 'string',
              },
            }
          }
        },
      },
    })
    payload: {
      name: 'string',
    }
  ) {
    const result = await this.departmentService.createDepartment(payload);

    if (result.statusCode === 400) {
      throw {
        statusCode: 400,
        message: 'Cannot find organization',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @get('/departments/count', {
    summary: 'Count departments API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async count() {
    const result = await this.departmentService.countDepartments();

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @get('/departments', {
    summary: 'List of departments API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async find() {
    const result = await this.departmentService.findDepartments();

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @get('/departments/{id}', {
    summary: 'Get departments by ID API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Department not found'},
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ) {
    const data = await this.departmentService.findDepartmentById(id);

    if (!data) {
      throw {
        statusCode: 404,
        message: 'Department not found',
      };
    }

    return {
      statusCode: 200,
      message: 'success',
      data,
    };
  }

  @authenticate('jwt')
  @patch('/departments/{id}', {
    summary: 'Update departments API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'Update departments API Endpoint',
      content: {
        'application/json': {
          schema: {
            properties: {
              name: {type: 'string'},
              orgId: {type: 'string'},
            },
          },
        },
      },
    })
    payload: {
      name?: string;
      orgId?: string;
    },
  ) {
    const result = await this.departmentService.updateDepartmentById(id, payload);

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return result;
  }

  @authenticate('jwt')
  @del('/departments/{id}', {
    summary: 'Delete departments API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found or already deleted'},
    },
  })
  async deleteById(@param.path.string('id') id: string) {
    const result = await this.departmentService.deleteDepartmentById(id);

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found or already deleted',
      };
    }

    return result;
  }
}
