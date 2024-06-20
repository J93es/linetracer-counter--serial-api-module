import { useEffect, useState } from "react";

import { SectorRecordType } from "component/admin/model/SectorRecord";

import SelectTarget from "component/utils/selectTarget/Index";
import Accordion from "component/utils/Accordion";
import RetouchCounterDeviceLog from "component/admin/manager/counterDeviceLogManager/RetouchCounterDeviceLog";
import DropDown from "component/utils/DropDown";
import DeleteCounterDeviceLogBtn from "component/admin/manager/counterDeviceLogManager/DeleteCounterDeviceLog";
import AddDriveRecord from "component/admin/manager/counterDeviceLogManager/AddDriveRecord";
import CounterDevice from "component/admin/manager/counterDeviceLogManager/CounterDevice";

import DriveRecordDistinction from "component/admin/model/distinction/DriveRecordDistinction";

import { CounterDeviceLogType } from "component/admin/model/CounterDeviceLog";
import { counterDeviceLogEditMenuEnum } from "component/admin/model/enums/index";
import { isEmptyArray } from "component/admin/tools/utils";

export default function CounterDeviceLogManager({
  counterDeviceLogList,
  setCounterDeviceLogListUpdateSignal,
  setContestUpdateSignal,
  isBlocked,
  hostId,
  targetSectorRecord,
}: {
  counterDeviceLogList: CounterDeviceLogType[] | undefined;
  setCounterDeviceLogListUpdateSignal: React.Dispatch<
    React.SetStateAction<number>
  >;
  setContestUpdateSignal: React.Dispatch<React.SetStateAction<number>>;
  isBlocked: boolean;
  hostId: string | undefined;
  targetSectorRecord: SectorRecordType | undefined;
}) {
  const [editMenu, setEditMenu] = useState<string>(
    counterDeviceLogEditMenuEnum[0]
  );

  const [targetCounterDeviceLog, setTargetCounterDeviceLog] = useState<
    CounterDeviceLogType | undefined
  >();

  useEffect(() => {
    if (!counterDeviceLogList || isEmptyArray(counterDeviceLogList)) {
      setTargetCounterDeviceLog(undefined);
      return;
    }
    setTargetCounterDeviceLog(
      counterDeviceLogList[counterDeviceLogList.length - 1]
    );
  }, [counterDeviceLogList]);

  let retouchHtml = null;
  if (isBlocked) {
    retouchHtml = <p>수정이 불가능 합니다.</p>;
  } else if (!counterDeviceLogList) {
    retouchHtml = <p>계수기 로그가 없습니다.</p>;
  } else if (!targetCounterDeviceLog) {
    retouchHtml = <p>계수기 로그를 선택하세요.</p>;
  } else if (editMenu === "계수기 로그 수정") {
    retouchHtml = (
      <RetouchCounterDeviceLog
        setCounterDeviceLogListUpdateSignal={
          setCounterDeviceLogListUpdateSignal
        }
        targetCounterDeviceLog={targetCounterDeviceLog}
      />
    );
  } else if (editMenu === "계수기 로그 삭제") {
    retouchHtml = (
      <DeleteCounterDeviceLogBtn
        setCounterDeviceLogUpdateSignal={setCounterDeviceLogListUpdateSignal}
        targetCounterDeviceLog={targetCounterDeviceLog}
      />
    );
  } else if (editMenu === "주행 기록에 추가" && targetSectorRecord) {
    retouchHtml = (
      <AddDriveRecord
        targetCounterDeviceLog={targetCounterDeviceLog}
        targetSectorRecordId={targetSectorRecord?.id ?? ""}
        setContestUpdateSignal={setContestUpdateSignal}
      />
    );
  } else if (editMenu === "주행 기록에 추가" && !targetSectorRecord) {
    retouchHtml = <p>부문을 선택하세요.</p>;
  }

  return (
    <Accordion
      id="counter-device-log-manager"
      title="계수기 로그 수정"
      body={
        <div className="counter-device-log-manager">
          <SelectTarget
            target={targetCounterDeviceLog}
            setTarget={setTargetCounterDeviceLog}
            listOfObject={counterDeviceLogList}
            DistintionClass={DriveRecordDistinction}
            setUpdateSignal={() => {
              setCounterDeviceLogListUpdateSignal(
                (prev: number) => (prev + 1) % 1000
              );
            }}
            disabled={false}
          />

          <DropDown
            target={editMenu}
            onClick={setEditMenu}
            menuList={counterDeviceLogEditMenuEnum}
          />

          {retouchHtml}

          <CounterDevice
            setContestUpdateSignal={setContestUpdateSignal}
            setCounterDeviceLogListUpdateSignal={
              setCounterDeviceLogListUpdateSignal
            }
            hostId={hostId}
          />
        </div>
      }
    />
  );
}
