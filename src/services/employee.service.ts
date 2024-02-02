import {injectable, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {DepartmentRepository, EmployeeRepository} from '../repositories';
import {Employee} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class EmployeeService {
  constructor(
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
    @repository(DepartmentRepository)
    public departmentRepository: DepartmentRepository,
  ) { }

  //create employee repository
  async createEmployee(payload: {
    depId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    hire_date: string;
    salary: number;
  }) {
    const department = await this.departmentRepository.findOne({
      where: {
        id: payload.depId,
        isDeleted: false,
      },
    });

    if (department) {
      const data = await this.employeeRepository.create(payload);
      return {
        statusCode: 200,
        message: 'created successfully',
        data,
      };
    } else {
      return {
        statusCode: 400,
        message: 'Cannot find department',
      };
    }
  }

  //count employee repository
  async countEmployee() {
    const data = await this.employeeRepository.find({
      where: {
        isDeleted: false,
      }
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
      message: 'success',
      count
    }
  }

  //find employee repository
  async findEmployee() {
    const data = await this.employeeRepository.find({
      where: {
        isDeleted: false
      }
    });

    if (!data || data.length === 0) {
      return {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    return {
      statusCode: 200,
      message: 'success',
      data
    }
  }

  //findById employee repository
  async findEmployeeById(id: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: {
        id,
        isDeleted: false
      }
    });
  }

  //update employee repository
  async updateEmployeeById(
    id: string,
    payload: {
      depId?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: number;
      hire_date?: string;
      salary?: number;
    }
  ) {
    const existingData = await this.employeeRepository.findOne({
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

    const result = await this.employeeRepository.updateById(id, payload);

    return {
      statusCode: 200,
      message: 'Success',
      result,
    };
  }
  //delete employee repository
  async deleteEmployeeById(id: string) {
    const existingData = await this.employeeRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!existingData) {
      return {
        statusCode: 404,
        message: 'Employee data already deleted',
      };
    }

    const result = await this.employeeRepository.updateById(id, {
      isDeleted: true,
    });

    return {
      statusCode: 200,
      message: 'Success',
      result,
    };
  }
}
