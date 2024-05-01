import { ParticipantServiceInterface } from "../core/service/participant";

import Participant, { ParticipantType } from "../model/Participant";

import { ParticipantRepository } from "../core/repository/participant";
import { ParticipantMongoRepo } from "../repository/mongo/participant";

const participantRepository: ParticipantRepository = new ParticipantMongoRepo();

let instance: ParticipantService | null = null;
export class ParticipantService implements ParticipantServiceInterface {
  constructor() {
    if (instance) return instance;
    instance = this;
  }

  private _idFilter(_id: string, srcData: Partial<ParticipantType>): void {
    if (!srcData._id) {
      throw new Error("_id is required");
    }
    if (String(_id) !== String(srcData._id)) {
      throw new Error(
        "_id is not matched : query _id and body _id is different"
      );
    }
  }

  private patchReadonlyFilter(
    srcParticipant: Partial<ParticipantType>
  ): Partial<ParticipantType> {
    const filteredParticipant = JSON.parse(JSON.stringify(srcParticipant));

    delete filteredParticipant.name;
    delete filteredParticipant.association;
    delete filteredParticipant.speech;
    delete filteredParticipant.robot;

    return filteredParticipant;
  }

  async postParticipant(
    data: Partial<ParticipantType>
  ): Promise<ParticipantType> {
    const srcParticipant: Partial<ParticipantType> = new Participant(
      data as ParticipantType
    );
    const participant: Partial<ParticipantType> =
      await participantRepository.createParticipant(
        srcParticipant as ParticipantType
      );

    return new Participant(participant as ParticipantType);
  }

  async patchParticipant(
    _id: string,
    data: Partial<ParticipantType>
  ): Promise<ParticipantType> {
    let srcParticipant: Partial<ParticipantType> = new Participant(
      data as ParticipantType
    );

    this._idFilter(_id, srcParticipant);

    srcParticipant = this.patchReadonlyFilter(srcParticipant);

    const participant: Partial<ParticipantType> =
      await participantRepository.updateParticipant(_id, srcParticipant);

    return new Participant(participant as ParticipantType);
  }

  async putParticipant(
    _id: string,
    data: Partial<ParticipantType>
  ): Promise<ParticipantType> {
    const srcParticipant: Partial<ParticipantType> = new Participant(
      data as ParticipantType
    );

    this._idFilter(_id, srcParticipant);

    const participant: Partial<ParticipantType> =
      await participantRepository.updateParticipant(_id, srcParticipant);

    return new Participant(participant as ParticipantType);
  }

  async getParticipant(_id: string): Promise<ParticipantType> {
    const participant: Partial<ParticipantType> =
      await participantRepository.readParticipantWithJoin(_id, {});

    return new Participant(participant as ParticipantType);
  }

  async getParticipantIndex(contest_Id: string): Promise<ParticipantType[]> {
    const participantList: Partial<ParticipantType>[] =
      await participantRepository.readParticipantIndex(contest_Id);

    return participantList.map(
      (participant) => new Participant(participant as ParticipantType)
    );
  }

  async removeParticipant(_id: string): Promise<ParticipantType> {
    const participant: Partial<ParticipantType> =
      await participantRepository.deleteParticipant(_id);

    return new Participant(participant as ParticipantType);
  }
}