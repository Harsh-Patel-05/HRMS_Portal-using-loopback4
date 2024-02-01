import {injectable, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {EmployeeRepository, LeaveRequestRepository} from '../repositories';
import {LeaveRequest} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class LeaveRequestService {
  constructor(
    @repository(EmployeeRepository)
    private employeeRepository: EmployeeRepository,
    @repository(LeaveRequestRepository)
    private leaveRequestRepository: LeaveRequestRepository,
  ) { }

  async createLeaveRequest(payload: {
    empId: string;
    start_date: string;
    end_date: string;
    leave_type: string;
  }) {
    const employee = await this.employeeRepository.findOne({
      where: {
        id: payload.empId,
        isDeleted: false,
      },
    });

    if (employee) {
      const data = await this.leaveRequestRepository.create(payload);
      return {
        statusCode: 200,
        message: 'Leave request created successfully',
        data,
      };
    } else {
      return {
        statusCode: 404,
        message: 'Employee not found',
      };
    }
  }

  async countLeaveRequest() {
    const data = await this.leaveRequestRepository.find({
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

  async findLeaveRequest() {
    const data = await this.leaveRequestRepository.find({
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

  async findLeaveRequestById(id: string): Promise<LeaveRequest | null> {
    return this.leaveRequestRepository.findOne({
      where: {
        id,
        isDeleted: false
      }
    });
  }

  async updateLeaveRequestById(
    id: string,
    payload: {
      empId: string;
      start_date: string;
      end_date: string;
      leave_type: string;
    }
  ) {
    const existingData = await this.leaveRequestRepository.findOne({
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

    const result = await this.leaveRequestRepository.updateById(id, payload);

    return {
      statusCode: 200,
      message: 'Success',
      result,
    };
  }

  async deleteLeaveRequestById(id: string) {
    const existingData = await this.leaveRequestRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!existingData) {
      return {
        statusCode: 404,
        message: 'LeaveRequest data already deleted',
      };
    }

    const result = await this.leaveRequestRepository.updateById(id, {
      isDeleted: true,
    });

    return {
      statusCode: 200,
      message: 'Success',
      result,
    };
  }
}
