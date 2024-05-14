import { ContestType } from "model/Contest";
import { SectorRecordType } from "model/SectorRecord";

import { ContestController } from "controller/ContestController";
import { SectorRecordController } from "controller/SectorRecordController";

import { getNextParticipant } from "tools/utils";

const contestController = new ContestController();
const sectorRecordController = new SectorRecordController();

export default function LaunchSectorRecord({
  setContestUpdateSignal,
  targetContest,
  targetSectorRecord,
  isSectorRecordLaunched,
  setIsSectorRecordLaunched,
  disabled,
}: {
  setContestUpdateSignal: Function;
  targetContest: Partial<ContestType>;
  targetSectorRecord: Partial<SectorRecordType>;
  isSectorRecordLaunched: boolean;
  setIsSectorRecordLaunched: Function;
  disabled: boolean;
}) {
  const startProgress = () => {
    const func = async () => {
      const targetParticipantId = targetSectorRecord.hostId;

      const nextParticipant = getNextParticipant(
        targetContest.curContestingSection || "",
        targetParticipantId,
        targetContest.participantList ?? []
      );

      const contest: Partial<ContestType> = {
        _id: targetContest._id,
        curParticipant: targetParticipantId,
        nextParticipant: nextParticipant._id,
        curSectorRecord: targetSectorRecord._id,
      };

      const sectorRecord: Partial<SectorRecordType> = {
        _id: targetSectorRecord._id,
        hostId: targetSectorRecord.hostId,
        sectorState: "running",
      };

      await contestController.patch(targetContest._id, contest);
      await sectorRecordController.patch(targetSectorRecord._id, sectorRecord);
      setContestUpdateSignal((prev: number) => (prev + 1) % 1000);
    };
    func();
  };

  const stopProgress = async () => {
    const sectorRecord: Partial<SectorRecordType> = {
      _id: targetSectorRecord._id,
      hostId: targetSectorRecord.hostId,
      sectorState: "end",
    };

    await sectorRecordController.patch(targetSectorRecord._id, sectorRecord);
    setContestUpdateSignal((prev: number) => (prev + 1) % 1000);
  };

  const onClick = () => {
    // start => stop
    if (isSectorRecordLaunched) {
      setIsSectorRecordLaunched(false);
      stopProgress();
      return;
    }
    // stop => start
    setIsSectorRecordLaunched(true);
    startProgress();
  };

  return (
    <div className="manage-progress-btn">
      <h5>참가자 경연 시작/종료 관리</h5>
      <button
        type="button"
        className="btn btn-primary"
        disabled={disabled}
        onClick={onClick}
      >
        {isSectorRecordLaunched ? "참가자 경연 종료" : "참가자 경연 시작"}
      </button>
    </div>
  );
}