import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ChatSplitValidPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value.splitNumber = Number(value.splitNumber);
    value.splitPageNumber = Number(value.splitPageNumber);

    if (!this.isValid(value)) {
      throw new BadRequestException(
        '데이터 입력에서 알 수 없는 오류가 발생했습니다.',
      );
    }
    return value;
  }

  private isValid(value) {
    const { splitNumber, splitPageNumber } = value;

    if (
      typeof splitNumber !== 'number' ||
      typeof splitPageNumber !== 'number'
    ) {
      throw new BadRequestException(
        'splitNumber, splitPageNumber 입력 타입에 오류가 있습니다.',
      );
    }

    if (splitNumber == null || splitPageNumber == null) {
      throw new BadRequestException(
        'splitNumber, splitPageNumber는 비워 둘 수 없습니다.',
      );
    }

    return true;
  }
}

export class CreateUserChatValidPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value.maxParty = Number(value.maxParty);

    if (!this.isValid(value)) {
      throw new BadRequestException(
        '방 생성 입력에서 알 수 없는 오류가 발생했습니다.',
      );
    }
    return value;
  }

  private isValid(value) {
    const { maxParty, roomName } = value;

    if (typeof maxParty !== 'number' || typeof roomName !== 'string') {
      throw new BadRequestException(
        'maxParty, roomName의 타입이 올바르지 않습니다.',
      );
    }

    if (maxParty == null || roomName == null) {
      throw new BadRequestException(
        'maxParty, roomName은 비어있을 수 없습니다.',
      );
    }

    return true;
  }
}

export class CreateChatSaveValidPip implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.isValid(value)) {
      throw new BadRequestException(
        '입력 값에서 알 수 없는 오류가 발생했습니다.',
      );
    }
    return value;
  }

  private isValid(value) {
    const { room, saveData, nickname } = value;

    if (
      typeof room !== 'string' ||
      typeof saveData !== 'string' ||
      typeof nickname !== 'string'
    ) {
      throw new BadRequestException(
        'room, saveData, nickname 타입은 string입니다.',
      );
    }

    if (room == null || saveData == null || nickname == null) {
      throw new BadRequestException(
        'room, saveData, nickname은 비어있을 수 없습니다.',
      );
    }

    return true;
  }
}
