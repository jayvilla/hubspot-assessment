import { Conversation } from "interfaces/conversations.interface";
import { MessageData } from "interfaces/messageData.interface";
import { Message } from "interfaces/messages.interface";
import { User } from "interfaces/user.interface";
import { postResult } from "lib/postResult";
import { NextPage, NextPageContext } from "next"
import { useEffect } from "react";

interface PageProps {
  messageData: MessageData;
}

const Page: NextPage<PageProps, {}> = (props: PageProps) => {
  useEffect(() => {
    if (props?.messageData) {
      (async () => {
        // define variables
        const messages: Message[] = props?.messageData?.messages;
        const userId: number = props?.messageData?.userId;
        const users: User[] = props?.messageData?.users;
        const conversations: Conversation[] = [];

        // sort messages in order first before going through each
        const sortedMessages = sortMessages(messages);

        for (let i = 0; i < sortedMessages.length; i++) {
          const message = sortedMessages[i];

          // attempt to find conversation if it already exists
          const foundConversationIndex = conversations.findIndex(
            (conversation) =>
              conversation.userId === message.fromUserId ||
              conversation.userId === message.toUserId
          );

          // set user id from message that isn't own
          const uid =
            message.fromUserId === userId
              ? message.toUserId
              : message.fromUserId;


          // attempt to find user index from users array
          const foundUserIndex = users?.findIndex((user) => user.id === uid);


          // if user not found move to next iteration
          if (foundUserIndex === -1) {
            continue;
          }

          const user = users[foundUserIndex];

          // if no conversation exists initialize a conversation
          if (foundConversationIndex < 0) {
            const conversation = {
              avatar: user.avatar,
              firstName: user.firstName,
              lastName: user.lastName,
              // since messages are already sorted, the first message from each conversation should be the most recent
              mostRecentMessage: {
                content: message.content,
                timestamp: message.timestamp,
                userId: message.fromUserId,
              },
              totalMessages: 1,
              userId: user.id,
            };
            // add new conversation 
            conversations.push(conversation);
          } else {
            // only need to update message count of existing conversation
            let updatedConversation = conversations[foundConversationIndex];
            updatedConversation = {
              ...updatedConversation,
              totalMessages: (updatedConversation.totalMessages += 1),
            };
          }
        }
        const response = await postResult(conversations);
        console.log('response', response);
      })();
    }
  }, [props?.messageData])

  const sortMessages = (messages: Message[]) => {
    return messages?.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1)
  }

  return (
    <>
      <div>Hubspot Assessment (Check console log for results)</div>
    </>
  );
};

export const getServerSideProps = async () => {
  // used getServerSideProps() to hide sensitive information from the public
  let messageData = [];
  try {
    const response = await fetch(
      `${process.env.HUBSPOT_API_URL}/dataset?userKey=${process.env.API_KEY}`
    );
    messageData = await response.json();
  } catch(e) {
    console.error(e);
  }
  return {
    props: {
      // pass messages as a prop to page component
      messageData,
    },
  };
};

export default Page;
