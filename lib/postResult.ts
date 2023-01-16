import { Conversation } from "interfaces/conversations.interface";

export const postResult = async (conversations: Conversation[]) => {
  try {
    const response = await fetch('/api/result',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({conversations})
    })
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}