import { useState, useEffect, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useAgentSocket from "./useAgentSocket";
import {
  conversationDetail,
  conversationSendMesaage,
  resetConversation,
  createconversation
} from "../api/conversation/conversationSlicer";
import {
  RECOMMENDATOINVIEW,
  DETAILVIEW,
  QUESTIONVIEW
} from "../constant/chatContentConstant";

export default function useChat(uiActions) {
  const [groupedMessages, setGroupedMessages] = useState({});
  const { currentIntent } = useAgentSocket();
  const [systemMessage, setSystemMessage] = useState(null);
  const [completeMessage, setCompleteMessage] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewAction, setViewAction] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [conversationInformation, setConversationInformation] = useState();
  const [conversationMessages, setConversationMessages] = useState([]);
  const [conversationid, setConversationid] = useState();
  const [queuedMessage, setQueuedMessage] = useState(null);
  const [recommendation, setRecommendation] = useState({})

  const [userIntent, setUserIntent] = useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isProductLoading,
    isProcudtSuccess,
    isProductError,
    productData
  } = useSelector((state) => state.product);
  const {
    isSuccess,
    isConversationLoading,
    isConversationMemory,
    conversation,
    conversationCreated,
    conversationid: createdConversationid,
    conversationNewMessage,
    intent,
  } = useSelector((state) => state.conversation);
  const { stream } = useSelector((state) => state.stream);
  const [lastMessageId, setLastMessageId] = useState(null);


  const { id: conversationParamid } = useParams();

  useEffect(() => {
    if (conversationParamid != null)
      setConversationid(conversationParamid)
  }, [conversationParamid])

  useEffect(() => {
    if (uiActions?.onCreateConversationid) uiActions.onCreateConversationid(conversationid);
  }, [conversationid])



  const groupMessagesByGroupId = (messages = []) => {
    console.log("🔃 groupMessagesByGroupId çağrıldı:", messages);
    return messages.reduce((groups, message) => {
      if (!groups[message.groupid]) {
        groups[message.groupid] = [];
      }
      groups[message.groupid].push(message);
      return groups;
    }, {});
  };



  const updateMessageBlock = useCallback((messages) => {
    console.log("🧱 updateMessageBlock çağrıldı:", messages);
    const grouped = groupMessagesByGroupId(messages);
    const pages = Object.keys(grouped);
    const lastPage = pages.length;


    console.log("🧱 Gruplaştırma :", grouped);


    setGroupedMessages(grouped);
    setTotalCount(lastPage);
    setCurrentPage(lastPage);


    const latestSystemMessage = grouped[pages[lastPage - 1]] || [];
    const intentAction = latestSystemMessage[1]?.type === "system_message" ? latestSystemMessage[1].intent : "";

    console.log("📤 Sistem mesajı ve action:", latestSystemMessage, intentAction);

    setViewAction(
      intentAction === RECOMMENDATOINVIEW ? RECOMMENDATOINVIEW :
        intentAction === QUESTIONVIEW ? QUESTIONVIEW :
          intentAction === DETAILVIEW ? DETAILVIEW :
            RECOMMENDATOINVIEW
    );
    setSystemMessage(latestSystemMessage);
  }, []);



  useEffect(() => {
    if (
      conversationNewMessage &&
      conversationNewMessage.id !== lastMessageId &&
      conversationNewMessage.human_message &&
      conversationNewMessage.system_message
    ) {
      console.log("📩 Yeni mesaj alındı:", conversationNewMessage);

      setConversationMessages((prevMessages) => {
        console.log("prevMessages", prevMessages)
        const updatedMessages = [
          ...prevMessages, conversationNewMessage.human_message, conversationNewMessage.system_message
        ];
        setCompleteMessage("");
        updateMessageBlock(updatedMessages);

        return updatedMessages;
      });
    }
  }, [conversationNewMessage]);

  useEffect(() => {
    if (intent) {
      setUserIntent(intent)
      /*  switch (currentIntent) {
         case "chat":
         case "recommendation":
           setViewAction(RECOMMENDATOINVIEW);
           break;
         case "production_info":
         case "services_info":
           setViewAction(DETAILVIEW);
           break;
         default:
           break;
       } */
    }
  }, [intent]);

  useEffect(() => {
    if (stream && stream !== "") {
      console.log("📡 stream verisi geldi:", stream);
      setCompleteMessage((prev) => prev + stream);
    }
  }, [stream]);

  useEffect(() => {
    if (
      conversation &&
      Array.isArray(conversationMessages) &&
      conversationMessages.length > 0 &&
      completeMessage
    ) {
      console.log("✏️ Stream tamamlandı, mesaj güncelleniyor");
      const updatedMessages = conversationMessages.map((msg, index) =>
        index === conversationMessages.length - 1 ? { ...msg, content: completeMessage } : msg
      );
      setConversationMessages(updatedMessages);
      updateMessageBlock(updatedMessages);
    }
  }, [completeMessage, conversation]);

  useEffect(() => {
    if (conversationid) {
      console.log("📄 Başlangıç konuşması yükleniyor:", conversationid);
      dispatch(conversationDetail({ conversationid }));
    }
  }, [conversationid, dispatch]);

  useEffect(() => {
    if (isProcudtSuccess && !isProductLoading && !isProductError) {
      console.log("🛍️ Ürün başarıyla yüklendi:", productData);
      handleViewAction(DETAILVIEW);
      setSelectedProduct(productData);
      if (uiActions?.onProductSelected) uiActions.onProductSelected(productData._id);
    }
  }, [isProductLoading, isProcudtSuccess, isProductError, productData, uiActions]);

  useEffect(() => {
    if (uiActions?.onUpdateActionView) {
      console.log("🔁 View action değişti:", viewAction);
      uiActions.onUpdateActionView(viewAction);
    }
  }, [viewAction]);

  const handleViewAction = (action) => {
    console.log("handleViewActionaction", action)
    const _action = action || (systemMessage && systemMessage[1]?.action) || RECOMMENDATOINVIEW;
    console.log("📌 handleViewAction çalıştı:", _action);
    setViewAction(_action);
  };

  const changePage = (page) => {
    if (page >= 1 && page <= totalCount) {
      console.log("📄 Sayfa değiştirildi:", page);
      setCurrentPage(page);
      const pages = Object.keys(groupedMessages);
      setSystemMessage(groupedMessages[pages[page - 1]] || []);
    }
  };

  useEffect(() => {
    if (!isConversationMemory && isSuccess && conversation) {
      console.log("💬 Konuşma başarıyla yüklendi:", conversation);
      setConversationInformation(conversation);
      setConversationMessages(conversation.messages || []);
      updateMessageBlock(conversation.messages || []);
    }
  }, [isConversationMemory, isSuccess, conversation]);

  useEffect(() => {
    if (!isConversationMemory && isSuccess && conversationCreated) {
      if (queuedMessage) {
        console.log("📨 Yeni konuşma oluşturuldu, kuyruk mesajı gönderiliyor:", queuedMessage);
        dispatch(conversationSendMesaage({ conversationid: createdConversationid, human_message: queuedMessage }));
        setQueuedMessage(null);
      } else {
        navigate(`/conversation/${createdConversationid}`);
        setConversationMessages([]);
        updateMessageBlock([]);
      }
    }
  }, [isConversationMemory, isSuccess, conversationCreated, queuedMessage, createdConversationid, dispatch, navigate]);

  const sendMessage = (message, selectedProductid) => {
    console.log("📬 sendMessage çağrıldı:", message, selectedProductid, conversationid);

    setSelectedProduct(null);
    if (conversationid) {
      dispatch(conversationSendMesaage({ conversationid, human_message: message, productid: selectedProductid }));
    } else {
      setQueuedMessage(message);
      dispatch(createconversation());
    }

    if (uiActions?.onPromptStart) uiActions.onPromptStart();
  };


  const createNewConversation = () => {
    console.log("createNewConversation", createNewConversation)
    dispatch(createconversation());
    if (uiActions?.onPromptStart) uiActions.onPromptStart();
  }
  const getConversationDetail = (conversationid) => {
    handleSetConversation(conversationid)
  }
  const handleSetConversation = (id) => {
    if (id) {
      console.log("🧭 Var olan konuşma set ediliyor:", id);
      setConversationid(id);
      dispatch(conversationDetail({ conversationid: id }));
    } else {
      console.log("🔄 Yeni konuşma başlatılıyor");
      dispatch(resetConversation());
      dispatch(createconversation());
      setConversationid(null);
    }
  };

  return {
    groupedMessages,
    systemMessage,
    totalCount,
    currentPage,
    viewAction,
    userIntent,
    selectedProduct,
    isConversationLoading,
    setSelectedProduct,
    createNewConversation,
    getConversationDetail,
    setSystemMessage,
    handleViewAction,
    setTotalCount,
    updateMessageBlock,
    changePage,
    sendMessage,
    conversationid,
    setConversationid,
    isProductLoading,
  };
}