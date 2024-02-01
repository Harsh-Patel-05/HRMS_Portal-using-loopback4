import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {OrganizationRepository} from '../repositories';
import {Organization} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class OrganizationService {
  constructor(
    @repository(OrganizationRepository)
    public organizationRepository: OrganizationRepository,
  ) { }

  async createOrganization(payload: {
    org_name: string,
    email: string,
    phone: number,
    website: string,
    city: string,
    state: string,
    zipcode: string,
  }): Promise<Organization> {
    return this.organizationRepository.create(payload);
  }

  async countOrganizations(): Promise<number> {
    const result = await this.organizationRepository.count({
      isDeleted: false,
    });

    return result.count ?? 0;
  }

  async findOrganizations(): Promise<Organization[]> {
    return this.organizationRepository.find({
      where: {
        isDeleted: false,
      },
    });
  }

  async findOrganizationById(id: string): Promise<Organization | null> {
    return this.organizationRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  async updateOrganizationById(
    id: string,
    payload: {
      org_name?: string;
      email?: string;
      phone?: number;
      website?: string;
      city?: string;
      state?: string;
      zipcode?: string;
    },
  ) {
    const existingData = await this.organizationRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!existingData) {
      return {
        statusCode: 404,
        message: 'Data Not Found',
      };
    }

    const result = await this.organizationRepository.updateById(id, {
      org_name: payload.org_name,
      email: payload.email,
      phone: payload.phone,
      website: payload.website,
      Address: {
        city: payload.city,
        state: payload.state,
        zipcode: payload.zipcode,
      },
    });

    return {
      statusCode: 200,
      message: 'Data Updated successfully',
      result,
    };
  }

  async deleteOrganizationById(id: string) {
    const existingData = await this.organizationRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!existingData) {
      return {
        statusCode: 404,
        message: 'Organization data already deleted',
      };
    }

    const result = await this.organizationRepository.updateById(id, {
      isDeleted: true,
    });

    return {
      statusCode: 200,
      message: 'Deleted Successfully',
    };
  }
}
