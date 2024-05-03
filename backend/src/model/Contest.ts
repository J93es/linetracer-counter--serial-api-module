export type ContestType = {
  _id: any;
  id: string;
  title: string;

  curContestingSection: string;

  contestTimerStartTime: number;
  driveStartTime: number;

  participantList: object[];
};

export default class Contest {
  _id: any;
  id: string;
  title: string;

  curContestingSection: string;

  contestTimerStartTime: number;
  driveStartTime: number;

  participantList: object[];

  constructor(data: ContestType) {
    this._id = data._id;
    this.id = data.id;
    this.title = data.title;

    this.curContestingSection = data.curContestingSection;

    this.contestTimerStartTime = data.contestTimerStartTime;
    this.driveStartTime = data.driveStartTime;

    this.participantList = data.participantList;
  }
}
