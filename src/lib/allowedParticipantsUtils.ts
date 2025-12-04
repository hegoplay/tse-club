// Utility functions for handling allowed participants

export const PARTICIPANT_TYPES = {
  STUDENT: 1,
  MEMBER: 2,
  LECTURER: 4,
  RESEARCHER: 8,
} as const;

export const PARTICIPANT_LABELS: Record<number, string> = {
  1: "Sinh viên",
  2: "Thành viên",
  4: "Giảng viên",
  8: "Nghiên cứu sinh",
};

/**
 * Converts allowedType bitmask to array of participant types
 */
export function getAllowedParticipants(allowedType: number): string[] {
  const participants: string[] = [];

  Object.entries(PARTICIPANT_TYPES).forEach(([key, value]) => {
    if ((allowedType & value) !== 0) {
      participants.push(PARTICIPANT_LABELS[value]);
    }
  });

  return participants;
}

/**
 * Formats allowed participants for display
 */
export function formatAllowedParticipants(
  allowedType: number,
  isPublic: boolean,
  t: (key: string) => string
): string {
  if (isPublic) {
    return t("PUBLIC_EVENT_ALL");
  }

  const participants = getAllowedParticipants(allowedType);

  if (participants.length === 0) {
    return t("NO_PARTICIPANTS");
  }

  return participants.join(", ");
}
