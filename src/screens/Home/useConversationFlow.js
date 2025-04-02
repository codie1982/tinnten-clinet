import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createconversation,
    conversation,
    resetConversation,
    conversationDetail,
} from "../../api/conversation/conversationSlicer";
import { useNavigate } from "react-router-dom";

export default function useConversationFlow(updateMessageBlock, initialConversationId = null) {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const {
        isSuccess,
        isLoading,
        detail,
        system_message,
        selectedConversationid,
        conversationCreated,
    } = useSelector((state) => state.conversation);

    const [conversationid, setConversationid] = useState(initialConversationId);
    const [queuedMessage, setQueuedMessage] = useState(null);

    // 👇 sayfa ilk yüklendiğinde detayları getir
    useEffect(() => {
        if (initialConversationId) {
            dispatch(conversationDetail({ conversationid: initialConversationId }));
        }
    }, [initialConversationId]);

    useEffect(() => {
        if (!isLoading && isSuccess && system_message) {
            updateMessageBlock(system_message.messages || []);
        }
    }, [isLoading, isSuccess, system_message]);

    useEffect(() => {
        if (!isLoading && isSuccess && conversationCreated && queuedMessage) {
            dispatch(conversation({ conversationid: selectedConversationid, human_message: queuedMessage }));
            setQueuedMessage(null);
        }
    }, [isLoading, isSuccess, conversationCreated, selectedConversationid]);

    const sendPrompt = (message) => {
        if (conversationid) {
            dispatch(conversation({ conversationid, human_message: message }));
        } else {
            setQueuedMessage(message);
            dispatch(createconversation());
        }
    };

    useEffect(() => {
        if (!isLoading && isSuccess && conversationCreated && queuedMessage) {
            dispatch(conversation({ conversationid: selectedConversationid, human_message: queuedMessage }));
            setQueuedMessage(null);
        }
    }, [conversationCreated, selectedConversationid]);

    useEffect(() => {
        if (!isLoading && isSuccess && system_message) {
            updateMessageBlock(system_message.messages || []);
        }
    }, [system_message]);

    const handleSetConversation = (id) => {
        if (id) {
            setConversationid(id);
            dispatch(conversationDetail({ conversationid: id }));
        } else {
            dispatch(resetConversation());
            dispatch(createconversation());
            setConversationid(null);
        }
    };

    return {
        sendPrompt,
        handleSetConversation,
        conversationid,
        setConversationid,
    };
}
