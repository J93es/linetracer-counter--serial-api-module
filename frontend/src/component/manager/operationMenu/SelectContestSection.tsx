import DropDown from "component/utils/DropDown";

import { ContestType } from "model/Contest";
import { ContestController } from "controller/ContestController";
import { sectorEnum } from "model/enums/index";

const contestController = new ContestController();

export default function SelectContestSection({
  setContestUpdateSignal,
  targetContest,
}: {
  setContestUpdateSignal: Function;
  targetContest: Partial<ContestType>;
}) {
  const onClick = (target: string) => {
    const func = async () => {
      await contestController.patch(targetContest._id, {
        _id: targetContest._id,
        curContestingSection: target,
      });
      setContestUpdateSignal((prev: number) => (prev + 1) % 1000);
    };
    func();
  };

  return (
    <div className="select-contest-section">
      <h5>현재 경연 부문 선택</h5>
      <DropDown
        target={targetContest.curContestingSection ?? sectorEnum[0]}
        onClick={onClick}
        menuList={sectorEnum}
      />
    </div>
  );
}
