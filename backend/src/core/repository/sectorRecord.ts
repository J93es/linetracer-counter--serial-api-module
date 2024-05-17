import { SectorRecordType } from "@model/SectorRecord";
import { DriveRecordType } from "@model/DriveRecord";

export interface SectorRecordRepository {
  isExist(id: string): Promise<Boolean>;
  create(data: SectorRecordType): Promise<SectorRecordType>;
  read(id: string): Promise<SectorRecordType>;
  update(
    data: Partial<SectorRecordType>,
    replace: boolean
  ): Promise<SectorRecordType>;
  delete(id: string): Promise<SectorRecordType>;
  appendDriveRecordList(
    id: string,
    driveRecord: DriveRecordType
  ): Promise<SectorRecordType>;
  popDriveRecordList(
    id: string,
    driveRecordId: string
  ): Promise<SectorRecordType>;
}
