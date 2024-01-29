import {
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Organization} from '../models';
import {OrganizationRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class OrganizationController {
  constructor(
    @repository(OrganizationRepository)
    public organizationRepository: OrganizationRepository,
  ) { }

  // @authenticate('jwt')
  @post('/organizations', {
    summary: 'Create organizations API Endpoint',
    responses: {
      '200': {},
    },
  })
  async create(
    @requestBody({
      description: 'Create organizations API Endpoint',
      content: {
        'application/json': {
          schema: {
            required: ['org_name', 'email', 'phone', 'website', 'city', 'state', 'zipcode;'],
            properties: {
              org_name: {
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
              website: {
                type: 'string',
              },
              city: {
                type: 'string',
              },
              state: {
                type: 'string',
              },
              zipcode: {
                type: 'string',
              }
            }
          }
        },
      },
    })
    payload: {
      org_name: 'string',
      email: 'string',
      phone: number,
      website: 'string',
      city: 'string',
      state: 'string',
      zipcode: 'string'
    }): Promise<Organization> {
    return this.organizationRepository.create({
      org_name: payload.org_name,
      email: payload.email,
      phone: payload.phone,
      website: payload.website,
      Address: {
        city: payload.city,
        state: payload.state,
        zipcode: payload.zipcode,
      }
    });
  }

  // @authenticate('jwt')
  @get('/organizations/count', {
    summary: 'Count organizations API Endpoint',
    responses: {
      '200': {},
    },
  })
  async count() {
    const data = await this.organizationRepository.find({
      where: {
        isDeleted: false
      }
    });

    if (!data) {
      return {
        statusCode: 404,
        message: 'Data not found'
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
  @get('/organizations', {
    summary: 'List of student API Endpoint',
    responses: {
      '200': {},
    },
  })
  async find() {
    const data = await this.organizationRepository.find({
      where: {
        isDeleted: false,
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
  @get('/organizations/{id}', {
    summary: 'Get organizations by id API Endpoint',
    responses: {
      '200': {}
    }
  })
  async findById(
    @param.path.string('id') id: string,
  ) {
    const data = await this.organizationRepository.findOne({
      where: {
        id,
        isDeleted: false
      }
    });

    if (!data) {
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
  @patch('/organizations/{id}', {
    summary: 'Update organizations API Endpoint',
    responses: {
      '200': {}
    }
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'Create organizations API Endpoint',
      content: {
        'application/json': {
          schema: {
            // required: ['org_name', 'email', 'phone', 'website', 'city', 'state', 'zipcode;'],
            properties: {
              org_name: {
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
              website: {
                type: 'string',
              },
              city: {
                type: 'string',
              },
              state: {
                type: 'string',
              },
              zipcode: {
                type: 'string',
              }
            }
          }
        },
      },
    })
    payload: {
      org_name: 'string',
      email: 'string',
      phone: number,
      website: 'string',
      city: 'string',
      state: 'string',
      zipcode: 'string'
    }) {
    const data = await this.organizationRepository.findOne({
      where: {
        id,
        isDeleted: false
      }
    });

    if (data) {
      const result = await this.organizationRepository.updateById(id, {
        org_name: payload.org_name,
        email: payload.email,
        phone: payload.phone,
        website: payload.website,
        Address: {
          city: payload.city,
          state: payload.state,
          zipcode: payload.zipcode
        }
      })
      return {
        statusCode: 200,
        message: 'Data Updated successfully',
        result
      }
    } else {
      return {
        statusCode: 404,
        message: 'Data Not Found'
      }
    }
  }

  // @authenticate('jwt')
  @del('/organizations/{id}', {
    summary: 'Delete organizations API Endpoint',
    responses: {
      '200': {},
    },
  })
  async deleteById(@param.path.string('id') id: string) {
    const data = await this.organizationRepository.findOne({
      where: {
        id,
        isDeleted: false
      }
    });

    if (data) {
      const result = await this.organizationRepository.updateById(id, {
        isDeleted: true
      })
      return {
        statusCode: 200,
        message: 'Deleted Successfully'
      }
    } else {
      return {
        statusCode: 404,
        message: 'Organization data already deleted'
      }
    }
  }
}
