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
import {DepartmentRepository, EmployeeRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class EmployeeController {
  constructor(
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
    @repository(DepartmentRepository)
    public departmentRepository: DepartmentRepository,
  ) { }

  @authenticate('jwt')
  @post('/employees', {
    summary: 'Create employees API Endpoint',
    responses: {
      '200': {},
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
      laststName: 'string',
      email: 'string',
      phone: number,
      hire_date: 'string',
      salary: number,
    }
  ) {
    const department = await this.departmentRepository.findOne({
      where: {
        id: payload.depId,
        isDeleted: false
      }
    });

    if (department) {
      const data = await this.employeeRepository.create(payload);
      return {
        statusCode: 200,
        message: 'created successfully',
        data
      }

    } else {
      return {
        statusCode: 404,
        message: 'can not found department',
      }
    }
  }

  @authenticate('jwt')
  @get('/employees/count', {
    summary: 'Count employees API Endpoint',
    responses: {
      '200': {},
    },
  })
  async count() {
    const data = await this.employeeRepository.find({
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
  @get('/employees', {
    summary: 'List of employees API Endpoint',
    responses: {
      '200': {}
    }
  })
  async find() {
    const data = await this.employeeRepository.find({
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

  @authenticate('jwt')
  @get('/employees/{id}', {
    summary: 'Get employees by Id API Endpoint',
    responses: {
      '200': {}
    }
  })
  async findById(
    @param.path.string('id') id: string,
  ) {
    const data = await this.employeeRepository.findOne({
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

  @authenticate('jwt')
  @patch('/employees/{id}', {
    summary: 'Update employees API Endpoint',
    responses: {
      '200': {}
    }
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'Create employees API Endpoint',
      content: {
        'application/json': {
          schema: {
            // required: ['depId', 'firstName', 'lastName', 'email', 'phone', 'hire_date', 'salary'],
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
      laststName: 'string',
      email: 'string',
      phone: number,
      hire_date: 'string',
      salary: number,
    }
  ) {
    const data = await this.employeeRepository.findOne({
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

    const result = await this.employeeRepository.updateById(data.id, payload);
    return {
      statusCode: 200,
      message: 'success',
      result
    }
  }

  @authenticate('jwt')
  @del('/employees/{id}', {
    summary: 'Delete employees API Endpoint',
    responses: {
      '200': {},
    },
  })
  async deleteById(@param.path.string('id') id: string) {
    const data = await this.employeeRepository.findOne({
      where: {
        id,
        isDeleted: false
      }
    })

    if (data) {
      const result = await this.employeeRepository.updateById(id, {
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
        message: 'Employees data already deleted'
      }
    }
  }
}
