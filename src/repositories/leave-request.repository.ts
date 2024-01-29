import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {LeaveRequest, LeaveRequestRelations} from '../models';

export class LeaveRequestRepository extends DefaultCrudRepository<
  LeaveRequest,
  typeof LeaveRequest.prototype.id,
  LeaveRequestRelations
> {
  constructor(
    @inject('datasources.mongo_db') dataSource: MongoDbDataSource,
  ) {
    super(LeaveRequest, dataSource);
  }
}
