import { ParticipantType } from "../../model/Participant";

import { ParticipantRepository } from "../../core/repository/participant";
import { ParticipantSchema } from "../../model/repository/ParticipantSchema";

import { ContestRepository } from "../../core/repository/contest";
import { ContestMongoRepo } from "../../repository/mongo/contest";

const contestRepository: ContestRepository = new ContestMongoRepo();

let instance: ParticipantMongoRepo | null = null;
export class ParticipantMongoRepo implements ParticipantRepository {
  constructor() {
    if (instance) return instance;
    instance = this;
  }

  private readonlyFilter(data: any) {
    const filteredData = JSON.parse(JSON.stringify(data));

    delete filteredData._id;
    delete filteredData.hostId;
    delete filteredData.participantRecordList;

    return filteredData;
  }

  async isExistParticipant(_id: any): Promise<Boolean> {
    if (await ParticipantSchema.exists({ _id: _id })) {
      return true;
    } else {
      return false;
    }
  }

  async createParticipant(data: Partial<ParticipantType>): Promise<any> {
    delete data._id;

    if (!(await contestRepository.isExistContest(data.hostId))) {
      throw new Error(
        "Contest data is not founded by hostId, check hostId field in Participant data"
      );
    }

    const participant = await ParticipantSchema.create(data);
    if (!participant) {
      throw new Error("Failed to create participant");
    }

    try {
      await contestRepository.appendParticipantList(
        data.hostId,
        participant._id
      );
    } catch (err) {
      throw new Error("Failed to append participant to contest, check hostId");
    }

    return participant;
  }

  async readEveryParticipant(contest_Id: any): Promise<any> {
    const participantIndex = await ParticipantSchema.find({
      hostId: contest_Id,
    })
      .populate({
        path: "participantRecordList",
      })
      .lean();
    if (!participantIndex) {
      throw new Error("Participant list not found");
    }

    return participantIndex;
  }

  async readParticipant(_id: any): Promise<any> {
    const participant = await ParticipantSchema.findOne({ _id: _id }).lean();
    if (!participant) {
      throw new Error("Participant not found");
    }

    return participant;
  }

  async readParticipantWithJoin(_id: any, selectField: object): Promise<any> {
    const contest = await ParticipantSchema.findOne({ _id: _id })
      .populate("participantRecordList", selectField)
      .lean();
    if (!contest) {
      throw new Error("Participant not found");
    }

    return contest;
  }

  async updateParticipant(
    _id: any,
    data: Partial<ParticipantType>
  ): Promise<any> {
    const filteredData = this.readonlyFilter(data);

    const participant = await ParticipantSchema.findOneAndUpdate(
      { _id: _id },
      filteredData,
      {
        returnDocument: "after",
      }
    ).lean();
    if (!participant) {
      throw new Error("Failed to update participant");
    }

    return participant;
  }

  async deleteParticipant(_id: any): Promise<any> {
    const participant = await ParticipantSchema.findOneAndDelete({
      _id: _id,
    }).lean();
    if (!participant) {
      throw new Error("Failed to delete participant, check participant _id");
    }

    if (JSON.stringify(participant.participantRecordList) !== "[]") {
      throw new Error(
        "Failed to delete participant, participantRecordList is not empty"
      );
    }
    try {
      await contestRepository.popParticipantList(
        participant.hostId,
        participant._id
      );
    } catch (err) {
      throw new Error("Failed to pop participant from contest, check hostId");
    }

    return participant;
  }

  async appendParticipantRecordList(
    _id: any,
    participantRecordId: any
  ): Promise<any> {
    const contest = await ParticipantSchema.findOneAndUpdate(
      { _id: _id },
      {
        $addToSet: { participantRecordList: participantRecordId },
      },
      {
        returnDocument: "after",
      }
    ).lean();
    if (!contest) {
      throw new Error("Failed to append participant list");
    }

    return participantRecordId;
  }

  async popParticipantRecordList(
    _id: any,
    _participantRecordId: any
  ): Promise<any> {
    const contest = await ParticipantSchema.findOneAndUpdate(
      { _id: _id },
      {
        $pull: { participantRecordList: _participantRecordId },
      },
      {
        returnDocument: "after",
      }
    ).lean();
    if (!contest) {
      throw new Error("Failed to remove participant list");
    }

    return _participantRecordId;
  }
}
