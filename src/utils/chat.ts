import { AssetShareStatus } from "@/app/types/client-chat";
import { ChatRoomInfoResponse } from "@/services/chat";

export const parseToChatRoomInfo = (
  myId: number,
  data: {
    roomId: number;
    userId: number;
    userId2: number;
    isAgree?: boolean;
    isAgree2?: boolean;
  },
): ChatRoomInfoResponse => {
  let partnerId = null;
  let isAgreeMe = null;
  let isAgreePartner = null;
  let agreeStatus = AssetShareStatus.PENDING;

  if (data.userId === myId) {
    partnerId = data.userId2;
    isAgreePartner = data.isAgree2;
    isAgreeMe = data.isAgree;
  } else if (data.userId2 === myId) {
    partnerId = data.userId;
    isAgreePartner = data.isAgree;
    isAgreeMe = data.isAgree2;
  }

  if (!partnerId) throw new Error("유효하지 않은 접근입니다.");

  if (isAgreeMe === true && isAgreePartner === true) {
    // 둘다 동의
    agreeStatus = AssetShareStatus.BOTH_AGREED;
  } else if (isAgreeMe === true && isAgreePartner === null) {
    // 나는 동의 상대방은 대기
    agreeStatus = AssetShareStatus.ME_AGREED;
  } else if (isAgreePartner === true && isAgreeMe === null) {
    // 나는 대기 상대방은 동의
    agreeStatus = AssetShareStatus.PARTNER_AGREED;
  } else if (isAgreeMe === false || isAgreePartner === false) {
    // 나 또는 상대방이 거절
    agreeStatus = AssetShareStatus.REJECTED;
  } else {
    // 둘다 대기
    agreeStatus = AssetShareStatus.PENDING;
  }

  return {
    roomId: data.roomId,
    myId: myId,
    partnerId: partnerId,
    agreeStatus: agreeStatus,
  };
};
