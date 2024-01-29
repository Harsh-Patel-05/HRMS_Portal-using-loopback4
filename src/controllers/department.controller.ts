import {
  repository
} from '@loopback/repository';
import {
  post,
  requestBody
} from '@loopback/rest';
import {DepartmentRepository, OrganizationRepository} from '../repositories';

export class DepartmentController {
  constructor(
    @repository(DepartmentRepository)
    public departmentRepository: DepartmentRepository,
    @repository(OrganizationRepository)
    public organizationRepository: OrganizationRepository,
  ) { }

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
    if (!organization) {
      return {
        statusCode: 400,
        message: 'can not found organization',
      }
    }
    const data = await this.departmentRepository.create(payload);
    return {
      statusCode: 200,
      message: 'created successfully',
      data
    }
  }

  // @get('/departments/count')
  // @response(200, {
  //   description: 'Department model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(Department) where?: Where<Department>,
  // ): Promise<Count> {
  //   return this.departmentRepository.count(where);
  // }

  // @get('/departments')
  // @response(200, {
  //   description: 'Array of Department model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Department, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(Department) filter?: Filter<Department>,
  // ): Promise<Department[]> {
  //   return this.departmentRepository.find(filter);
  // }

  // @get('/departments/{id}')
  // @response(200, {
  //   description: 'Department model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(Department, {includeRelations: true}),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.string('id') id: string,
  //   @param.filter(Department, {exclude: 'where'}) filter?: FilterExcludingWhere<Department>
  // ): Promise<Department> {
  //   return this.departmentRepository.findById(id, filter);
  // }

  // @patch('/departments/{id}')
  // @response(204, {
  //   description: 'Department PATCH success',
  // })
  // async updateById(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Department, {partial: true}),
  //       },
  //     },
  //   })
  //   department: Department,
  // ): Promise<void> {
  //   await this.departmentRepository.updateById(id, department);
  // }

  // @del('/departments/{id}')
  // @response(204, {
  //   description: 'Department DELETE success',
  // })
  // async deleteById(@param.path.string('id') id: string): Promise<void> {
  //   await this.departmentRepository.deleteById(id);
  // }
}
