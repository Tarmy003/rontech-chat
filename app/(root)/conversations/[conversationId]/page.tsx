"use client";

import ConversationContainer from '@/components/shared/conversation/ConversationContainer';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import Header from './_components/Header';
import ChatInput from './_components/input/ChatInput';
import Body from './_components/body/Body';
import RemoveFriendDialog from './_components/dialogs/RemoveFriendDialog';
import DeleteGroupDialog from './_components/dialogs/DeleteGroupDialog';
import LeaveGroupDialog from './_components/dialogs/LeaveGroupDialog';

type Props = {
  params: {
    conversationId: string;
  };
};

const ConversationPage = ({ params: { conversationId } }: Props) => {
  const convexId = conversationId as Id<"conversations">;
  const conversation = useQuery(api.conversation.get, {
    id: convexId,
  });

  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);

  if (conversation === undefined) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (conversation === null) {
    return (
      <p className="w-full h-full flex items-center justify-center">
        Conversation not found!
      </p>
    );
  }

  return (
    <ConversationContainer>
      <RemoveFriendDialog
        conversationId={convexId}
        open={removeFriendDialogOpen}
        setOpen={setRemoveFriendDialogOpen}
      />
      <DeleteGroupDialog
        conversationId={convexId}
        open={deleteGroupDialogOpen}
        setOpen={setDeleteGroupDialogOpen}
      />
      <LeaveGroupDialog
        conversationId={convexId}
        open={leaveGroupDialogOpen}
        setOpen={setLeaveGroupDialogOpen}
      />
      <Header
        name={
          conversation.isGroup
            ? conversation.name || ""
            : conversation.otherMember?.username || ""
        }
        imageUrl={
          conversation.isGroup ? undefined : conversation.otherMember?.imageUrl
        }
        options={
          conversation.isGroup
            ? [
                {
                  label: "Leave group",
                  destructive: false,
                  onClick: () => setLeaveGroupDialogOpen(true),
                },
                {
                  label: "Delete group",
                  destructive: true,
                  onClick: () => setDeleteGroupDialogOpen(true),
                },
              ]
            : [
                {
                  label: "Remove friend",
                  destructive: true,
                  onClick: () => setRemoveFriendDialogOpen(true),
                },
              ]
        }
      />
      <Body
        members={
          conversation.isGroup
            ? conversation.otherMembers
              ? conversation.otherMembers
              : []
            : conversation.otherMember
            ? [conversation.otherMember]
            : []
        }
      />
      <ChatInput />
    </ConversationContainer>
  );
};

export default ConversationPage;