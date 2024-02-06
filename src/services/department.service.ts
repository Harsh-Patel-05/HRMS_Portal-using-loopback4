import {BindingScope, inject, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {SecurityBindings} from '@loopback/security';
import {Department} from '../models';
import {DepartmentRepository, OrganizationRepository} from '../repositories';
import {AuthCredentials} from './authentication/jwt.auth.strategy';


@injectable({scope: BindingScope.TRANSIENT})
export class DepartmentService {
  orgId;
  constructor(
    @repository(DepartmentRepository)
    public departmentRepository: DepartmentRepository,
    @repository(OrganizationRepository)
    public organizationRepository: OrganizationRepository,
    @inject(SecurityBindings.USER)
    public authCredentials: AuthCredentials,
  ) {
    this.orgId = <string>authCredentials?.org?.id;
  }

  //create department repository
  async createDepartment(payload: {
    name: string;
  }) {
    const organization = await this.organizationRepository.findOne({
      where: {
        id: this.orgId,
        isDeleted: false,
      },
    });

    if (organization) {
      const data = await this.departmentRepository.create({
        name: payload.name,
        orgId: this.orgId
      });
      return {
        statusCode: 200,
        message: 'created successfully',
        data,
      };
    } else {
      return {
        statusCode: 400,
        message: 'Cannot find organization',
      };
    }
  }

  //count department repository
  async countDepartments() {
    const data = await this.departmentRepository.find({
      where: {
        isDeleted: false,
      },
    });

    if (!data || data.length === 0) {
      return {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    const count = data.length;

    return {
      statusCode: 200,
      message: 'Success',
      count,
    };
  }

  //find department repository
  async findDepartments() {
    const data = await this.departmentRepository.find({
      where: {
        isDeleted: false,
      },
    });

    if (!data || data.length === 0) {
      return {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return {
      statusCode: 200,
      message: 'Success',
      data,
    };
  }

  //findById department repository
  async findDepartmentById(id: string): Promise<Department | null> {
    return this.departmentRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  //update department repository
  async updateDepartmentById(
    id: string,
    payload: {
      name?: string;
      orgId?: string;
    },
  ) {
    const existingData = await this.departmentRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!existingData) {
      return {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    const result = await this.departmentRepository.updateById(id, payload);

    return {
      statusCode: 200,
      message: 'Success',
      result,
    };
  }

  //delete department repository
  async deleteDepartmentById(id: string) {
    const existingData = await this.departmentRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!existingData) {
      return {
        statusCode: 404,
        message: 'Departments data already deleted',
      };
    }

    const result = await this.departmentRepository.updateById(id, {
      isDeleted: true,
    });

    return {
      statusCode: 200,
      message: 'Success',
      result,
    };
  }
}
