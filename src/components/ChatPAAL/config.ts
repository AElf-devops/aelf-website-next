export function isPaalChatEnabled(
  value = process.env.NEXT_PUBLIC_PAAL_CHAT_ENABLED
) {
  return value === "true";
}
