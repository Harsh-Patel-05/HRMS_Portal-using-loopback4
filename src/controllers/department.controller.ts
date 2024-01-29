import {
  repository
} from '@loopback/repository';
import {
  post,
  del,
  get,
  requestBody,
  param,
  patch
} from '@loopback/rest';
import {DepartmentRepository, OrganizationRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class DepartmentController {
  constructor(
    @repository(DepartmentRepository)
    public departmentRepository: DepartmentRepository,
    @repository(OrganizationRepository)
    public organizationRepository: OrganizationRepository,
  ) { }

  @authenticate('jwt')
  @post('/departments', {
    summary: 'Create departments API Endpoint',
    responses: {
      '200': {},
    },
  })
  async create(
    @requestBody({
      description: 'Create departments API Endpoint',
      content: {
        'application/json': {
          schema: {
            required: ['name', 'orgId'],
            properties: {
              name: {
                type: 'string',
              },
              orgId: {
                type: 'string',
              }
            }
          }
        },
      },
    })
    payload: {
      name: 'string',
      orgId: 'string',
    }
  ) {
    const organization = await this.organizationRepository.findOne({
      where: {
        id: payload.orgId,
        isDeleted: false
      }
    })
    if (organization) {
      const data = await this.departmentRepository.create(payload);
      return {
        statusCode: 200,
        message: 'created successfully',
        data
      }
    } else {
      return {
        statusCode: 400,
        message: 'can not found organization',
      }
    }
  }

  @authenticate('jwt')
  @get('/departments/count', {
    summary: 'Count departments API Endpoint',
    responses: {
      '200': {},
    },
  })
  async count() {
    const data = await this.departmentRepository.find({
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

  @authenticate('jwt')
  @get('/departments', {
    summary: 'List of departments API Endpoint',
    responses: {
      '200': {}
    }
  })
  async find() {
    const data = await this.departmentRepository.find({
      where: {
        isDeleted: false
      }
    });

    if (!data[0]) {
      return {
        statusCode: 404,
        message: 'data not found',
      }
    }

    return {
      statusCode: 200,
      message: 'success',
      data
    }
  }

  @authenticate('jwt')
  @get('/departments/{id}', {
    summary: 'Get departments by Id API Endpoint',
    responses: {
      '200': {}
    }
  })
  async findById(
    @param.path.string('id') id: string,
  ) {
    const data = await this.departmentRepository.findOne({
      where: {
        id,
        isDeleted: false
      },
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
  @patch('/departments/{id}', {
    summary: 'Update departments API Endpoint',
    responses: {
      '200': {}
    }
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'Create departments API Endpoint',
      content: {
        'application/json': {
          schema: {
            // required: ['name', 'orgId'],
            properties: {
              name: {
                type: 'string',
              },
              orgId: {
                type: 'string',
              }
            }
          }
        },
      },
    })
    payload: {
      name: 'string',
      orgId: 'string',
    }
  ) {
    const data = await this.departmentRepository.findOne({
      where: {
        id,
        isDeleted: false
      }
    })

    if (data) {
      const result = await this.departmentRepository.updateById(data.id, payload);
      return {
        statusCode: 200,
        message: 'Success',
        result
      }
    } else {
      return {
        statusCode: 404,
        message: 'data not found',
      }
    }
  }

  @authenticate('jwt')
  @del('/departments/{id}', {
    summary: 'Delete departments API Endpoint',
    responses: {
      '200': {},
    },
  })
  async deleteById(@param.path.string('id') id: string) {
    const data = await this.departmentRepository.findOne({
      where: {
        id,
        isDeleted: false
      }
    })

    if (data) {
      const result = await this.departmentRepository.updateById(id, {
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
        message: 'Departments data already deleted'
      }
    }
  }
}
