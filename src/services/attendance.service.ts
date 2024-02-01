import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {AttendanceRepository, EmployeeRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class AttendanceService {
  constructor(
    @repository(AttendanceRepository)
    public attendanceRepository: AttendanceRepository,
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
  ) { }

  async createAttendance(payload: {
    empId: string;
    att_date: string;
    clock_in: string;
    clock_out: string;
  }) {
    const employee = await this.employeeRepository.findOne({
      where: {
        id: payload.empId,
        isDeleted: false,
      },
    });

    if (employee) {
      const result = await this.attendanceRepository.create(payload);
      return {
        statusCode: 200,
        message: 'Created successfully',
        result,
      };
    } else {
      return {
        statusCode: 404,
        message: 'Cannot find employee',
      };
    }
  }

  async countAttendances() {
    const data = await this.attendanceRepository.find({
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

  async findAttendances() {
    const data = await this.attendanceRepository.find({
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

  async findAttendanceById(id: string) {
    const data = await this.attendanceRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!data) {
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

  async updateAttendanceById(id: string, payload: {
    empId: string;
    att_date: string;
    clock_in: string;
    clock_out: string;
  }) {
    const data = await this.attendanceRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!data) {
      return {
        statusCode: 404,
        message: 'Data not found',
      };
    }

    const result = await this.attendanceRepository.updateById(data.id, payload);

    return {
      statusCode: 200,
      message: 'Success',
      result,
    };
  }

  async deleteAttendanceById(id: string) {
    const data = await this.attendanceRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (data) {
      const result = await this.attendanceRepository.updateById(data.id, {
        isDeleted: true,
      });
      return {
        statusCode: 200,
        message: 'Success',
        result,
      };
    } else {
      return {
        statusCode: 404,
        message: 'Data not found',
      };
    }
  }
}
