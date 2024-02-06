import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  param,
  patch,
  requestBody
} from '@loopback/rest';
import {OrganizationService} from '../services';

export class OrganizationController {
  constructor(
    @service(OrganizationService)
    public organizationService: OrganizationService,
  ) { }

  // @authenticate('jwt')
  // @post('/organizations', {
  //   summary: 'Create organizations API Endpoint',
  //   responses: {
  //     '200': {},
  //   },
  // })
  // async create(
  //   @requestBody({
  //     description: 'Create organizations API Endpoint',
  //     content: {
  //       'application/json': {
  //         schema: {
  //           required: ['org_name', 'email', 'phone', 'website', 'city', 'state', 'zipcode;'],
  //           properties: {
  //             org_name: {
  //               type: 'string',
  //             },
  //             email: {
  //               type: 'string',
  //               format: 'email',
  //               maxLength: 254,
  //               minLength: 5,
  //             },
  //             phone: {
  //               type: 'number',
  //             },
  //             website: {
  //               type: 'string',
  //             },
  //             city: {
  //               type: 'string',
  //             },
  //             state: {
  //               type: 'string',
  //             },
  //             zipcode: {
  //               type: 'string',
  //             }
  //           }
  //         }
  //       },
  //     },
  //   })
  //   payload: {
  //     org_name: 'string',
  //     email: 'string',
  //     phone: number,
  //     website: 'string',
  //     city: 'string',
  //     state: 'string',
  //     zipcode: 'string'
  //   }) {
  //   const data = await this.organizationService.createOrganization(
  //     payload.org_name,
  //     payload.email,
  //     payload.phone,
  //     payload.website,
  //     payload.city,
  //     payload.state,
  //     payload.zipcode
  //   );

  //   return {
  //     statusCode: 200,
  //     message: 'created successfully',
  //     data,
  //   };
  // }

  // @authenticate('jwt')
  // @get('/organizations/count', {
  //   summary: 'Count organizations API Endpoint',
  //   responses: {
  //     '200': {},
  //     '404': {description: 'No organizations found'},
  //   },
  // })
  // async count() {
  //   const data = await this.organizationService.countOrganizations();

  //   if (data === 0) {
  //     return {
  //       statusCode: 404,
  //       message: 'No organizations found'
  //     }
  //   }

  //   return {
  //     statusCode: 200,
  //     message: 'success',
  //     data
  //   }
  // }

  // @authenticate('jwt')
  // @get('/organizations', {
  //   summary: 'List of organizations API Endpoint',
  //   responses: {
  //     '200': {},
  //     '404': {description: 'No organizations found'},
  //   },
  // })
  // async find() {
  //   const data = await this.organizationService.findOrganizations();

  //   if (!data || data.length === 0) {
  //     throw {
  //       statusCode: 404,
  //       message: 'No organizations found',
  //     };
  //   }

  //   return {
  //     statusCode: 200,
  //     message: 'success',
  //     data,
  //   };
  // }

  // @authenticate('jwt')
  // @get('/organizations/{id}', {
  //   summary: 'Get organizations by ID API Endpoint',
  //   responses: {
  //     '200': {},
  //     '404': {description: 'Organization not found'},
  //   },
  // })
  // async findById(@param.path.string('id') id: string) {
  //   const data = await this.organizationService.findOrganizationById(id);

  //   if (!data) {
  //     throw {
  //       statusCode: 404,
  //       message: 'Organization not found',
  //     };
  //   }

  //   return {
  //     statusCode: 200,
  //     message: 'success',
  //     data,
  //   };
  // }

  @authenticate('jwt')
  @patch('/organizations/{id}', {
    summary: 'Update organizations API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Organization not found'},
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'Update organizations API Endpoint',
      content: {
        'application/json': {
          schema: {
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
      org_name?: string;
      email?: string;
      phone?: number;
      website?: string;
      city?: string;
      state?: string;
      zipcode?: string;
    }) {
    const result = await this.organizationService.updateOrganizationById(id, payload);

    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    return result;
  }

  // @authenticate('jwt')
  // @del('/organizations/{id}', {
  //   summary: 'Delete organizations API Endpoint',
  //   responses: {
  //     '200': {},
  //     '404': {description: 'Organization not found or data already deleted'},
  //   },
  // })
  // async deleteById(@param.path.string('id') id: string) {
  //   const result = await this.organizationService.deleteOrganizationById(id);

  //   if (result.statusCode === 404) {
  //     throw {
  //       statusCode: 404,
  //       message: 'Organization not found or data already deleted',
  //     };
  //   }

  //   return result;
  // }
}
