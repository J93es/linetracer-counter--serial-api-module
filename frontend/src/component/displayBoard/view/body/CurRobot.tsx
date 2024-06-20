import { ParticipantInfoType } from "component/displayBoard/model/ParticipantInfo";
import { RobotType } from "component/displayBoard/model/Robot";
import DisplayCard from "component/displayBoard/view/body/DisplayCard";

import "component/displayBoard/view/body/CurRobot.css";

const showKeys = [
  "name",
  "cpu",
  "rom",
  "ram",
  "motorDriver",
  "motor",
  "adc",
  "sensor",
];

export default function CurRobot({
  curParticipantInfo,
}: {
  curParticipantInfo: ParticipantInfoType | undefined;
}) {
  const curRobotInfo: RobotType | undefined = curParticipantInfo?.robot;

  const robotHtmlElem = showKeys.map((key, index) => {
    return (
      <div className="cur-robot-info-list-body-row" key={key}>
        <div className="cur-robot-info-list-body-col">{key}</div>
        <div className="cur-robot-info-list-body-col">
          {(curRobotInfo && curRobotInfo[key as keyof RobotType]) ?? "--"}
        </div>
      </div>
    );
  });

  return (
    <div className="cur-robot shadow">
      <DisplayCard
        htmlElement={
          <div className="cur-robot-cont">
            <h4 className="cur-robot-title">로봇 정보</h4>
            <div className="cur-robot-info-list">
              <div className="cur-robot-info-list-header">
                <div className="cur-robot-info-list-header-row">
                  <div className="cur-robot-info-list-header-col">분류</div>
                  <div className="cur-robot-info-list-header-col">정보</div>
                </div>
              </div>
              <div className="cur-robot-info-list-body">{robotHtmlElem}</div>
            </div>
          </div>
        }
      />
    </div>
  );
}
