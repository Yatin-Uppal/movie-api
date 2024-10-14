import { Injectable } from '@nestjs/common';
import { CommonService } from './common/common.service';

@Injectable()
export class AppService {
  constructor(private commonService: CommonService) {}
  getHello() {
    return this.commonService.customSuccessResponse(true, "APIs are working", 200)
  }
}
