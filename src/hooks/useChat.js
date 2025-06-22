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
import { resetStream } from "../api/stream/streamSlicer"

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
  const [recommendation, setRecommendation] = useState({});
  const [userIntent, setUserIntent] = useState("");
  const dispatch = useDispatch();

  const {
    isProductLoading,
    isProcudtSuccess,
    isProductError,
    productData,
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

  // conversationParamid değiştiğinde conversationid'yi güncelle
  useEffect(() => {
    if (conversationParamid != null) {
      console.log("📌 conversationParamid değişti:", conversationParamid);
      setConversationid(conversationParamid);
    }
  }, [conversationParamid]);

  // conversationid değiştiğinde uiActions'ı tetikle
  useEffect(() => {
    if (uiActions?.onCreateConversationid && conversationid) {
      console.log("📬 onCreateConversationid tetiklendi:", conversationid);
      uiActions.onCreateConversationid(conversationid);
    }
  }, [conversationid]);

  // Mesajları groupid'ye göre grupla
  const groupMessagesByGroupId = useCallback((messages = []) => {
    console.log("🔃 groupMessagesByGroupId çağrıldı:", messages);
    const grouped = messages.reduce((groups, message) => {
      if (!groups[message.groupid]) {
        groups[message.groupid] = [];
      }
      groups[message.groupid].push(message);
      return groups;
    }, {});
    console.log("🔃 groupMessagesByGroupId sonucu:", grouped);
    return grouped;
  }, []);

  // Mesaj bloğunu güncelle
  const updateMessageBlock = useCallback(
    (messages) => {
      console.log("🧱 updateMessageBlock çağrıldı:", messages);
      const grouped = groupMessagesByGroupId(messages);
      const pages = Object.keys(grouped);
      const lastPage = pages.length;

      console.log("🧱 Gruplaştırma:", grouped);

      setGroupedMessages(grouped);
      console.log("🧱 groupedMessages güncellendi:", grouped);

      setTotalCount(lastPage);
      console.log("🧱 totalCount güncellendi:", lastPage);

      setCurrentPage(lastPage);
      console.log("🧱 currentPage güncellendi:", lastPage);

      const latestSystemMessage = grouped[pages[lastPage - 1]] || [];
      const intentAction =
        latestSystemMessage[1]?.type === "system_message"
          ? latestSystemMessage[1].intent
          : "";

      console.log("📤 Sistem mesajı ve action:", latestSystemMessage, intentAction);

      const newViewAction =
        intentAction === RECOMMENDATOINVIEW
          ? RECOMMENDATOINVIEW
          : intentAction === QUESTIONVIEW
            ? QUESTIONVIEW
            : intentAction === DETAILVIEW
              ? DETAILVIEW
              : RECOMMENDATOINVIEW;

      setViewAction(newViewAction);
      console.log("🧱 viewAction güncellendi:", newViewAction);

      setSystemMessage(latestSystemMessage);
      console.log("🧱 systemMessage güncellendi:", latestSystemMessage);
    },
    [groupMessagesByGroupId]
  );

  // Yeni mesaj alındığında
  useEffect(() => {
    if (
      conversationNewMessage &&
      conversationNewMessage.id !== lastMessageId &&
      conversationNewMessage.human_message &&
      conversationNewMessage.system_message
    ) {
      console.log("📩 Yeni mesaj alındı:", conversationNewMessage);
      setLastMessageId(conversationNewMessage.id);
      console.log("📩 lastMessageId güncellendi:", conversationNewMessage.id);

      const updatedMessages = [
        ...conversationMessages,
        conversationNewMessage.human_message,
        conversationNewMessage.system_message,
      ];
      setConversationMessages(updatedMessages);
      console.log("📩 conversationMessages güncellendi:", updatedMessages);

      setCompleteMessage("");
      console.log("📩 completeMessage sıfırlandı");

      updateMessageBlock(updatedMessages);
    }
  }, [conversationNewMessage, lastMessageId, updateMessageBlock, conversationMessages]);

  // Intent güncellendiğinde
  useEffect(() => {
    if (intent) {
      console.log("🧠 Intent güncellendi:", intent);
      setUserIntent(intent);
      console.log("🧠 userIntent güncellendi:", intent);
    }
  }, [intent]);

  // Stream verisi alındığında
  useEffect(() => {
    if (stream && stream !== "") {
      setCompleteMessage((prev) => {
        const updated = prev + stream;
        // Eğer son mesaj zaten aynıysa güncellenmesin
        const last = conversationMessages[conversationMessages.length - 1]?.content || "";
        if (updated.trim() === last.trim()) return prev;
        return updated;
      });
      dispatch(resetStream()); // eklenmeli
    }
  }, [stream]);

  useEffect(() => {
    console.log("✏️ completeMessage güncellendi:", completeMessage);
  }, [completeMessage])
  useEffect(() => {
    console.log("💬 conversationMessages güncellendi:", conversationMessages);
  }, [conversationMessages])

  useEffect(() => {
    console.log("📄 systemMessage güncellendi:", systemMessage);
  }, [systemMessage])


  // completeMessage değiştiğinde (stream tamamlandığında)
  useEffect(() => {
    if (
      conversation &&
      Array.isArray(conversationMessages) &&
      conversationMessages.length > 0 &&
      completeMessage
    ) {
      console.log("✏️ Stream tamamlandı, mesaj güncelleniyor");
      const updatedMessages = conversationMessages.map((msg, index) =>
        index === conversationMessages.length - 1
          ? { ...msg, content: completeMessage }
          : msg
      );

      setConversationMessages(updatedMessages);
      updateMessageBlock(updatedMessages);

      // 🔽 systemMessage güncellenmeli (UI'nin görebilmesi için)
      const pages = Object.keys(groupMessagesByGroupId(updatedMessages));
      const lastPage = pages.length;
      const newSystemMessage = groupMessagesByGroupId(updatedMessages)[pages[lastPage - 1]];

      console.log("✏️ Yeni sistem mesajı:", newSystemMessage);
      setSystemMessage(newSystemMessage);
      console.log("✏️ systemMessage güncellendi (stream sonrası):", newSystemMessage);
    }
  }, [completeMessage, conversation, conversationMessages]);

  // conversationid değiştiğinde konuşma detaylarını yükle
  useEffect(() => {
    if (conversationid && conversationid !== conversation?.id) {
      console.log("📄 Başlangıç konuşması yükleniyor:", conversationid);
      dispatch(conversationDetail({ conversationid }));
    }
  }, [conversationid, dispatch, conversation?.id]);

  // Ürün başarıyla yüklendiğinde
  useEffect(() => {
    if (isProcudtSuccess && !isProductLoading && !isProductError) {
      console.log("🛍️ Ürün başarıyla yüklendi:", productData);
      handleViewAction(DETAILVIEW);
      setSelectedProduct(productData);
      console.log("🛍️ selectedProduct güncellendi:", productData);

      if (uiActions?.onProductSelected) {
        console.log("🛍️ onProductSelected tetiklendi:", productData._id);
        uiActions.onProductSelected(productData._id);
      }
    }
  }, [isProductLoading, isProcudtSuccess, isProductError, productData, uiActions]);

  // viewAction değiştiğinde
  useEffect(() => {
    if (uiActions?.onUpdateActionView && viewAction) {
      console.log("🔁 View action değişti:", viewAction);
      uiActions.onUpdateActionView(viewAction);
    }
  }, [viewAction, uiActions]);

  const handleViewAction = useCallback(
    (action) => {
      console.log("📌 handleViewAction çağrıldı, action:", action);
      const _action =
        action || (systemMessage && systemMessage[1]?.action) || RECOMMENDATOINVIEW;
      console.log("📌 handleViewAction çalıştı, _action:", _action);
      setViewAction(_action);
      console.log("📌 viewAction güncellendi:", _action);
    },
    [systemMessage]
  );

  const changePage = useCallback(
    (page) => {
      console.log("📄 changePage çağrıldı, page:", page);
      if (page >= 1 && page <= totalCount) {
        console.log("📄 Sayfa değiştirildi:", page);
        setCurrentPage(page);
        console.log("📄 currentPage güncellendi:", page);

        const pages = Object.keys(groupedMessages);
        const newSystemMessage = groupedMessages[pages[page - 1]] || [];
        setSystemMessage(newSystemMessage);
        console.log("📄 systemMessage güncellendi:", newSystemMessage);
      } else {
        console.log("📄 Geçersiz sayfa numarası:", page);
      }
    },
    [groupedMessages, totalCount]
  );

  // Konuşma başarıyla yüklendiğinde
  useEffect(() => {
    if (!isConversationMemory && isSuccess && conversation && conversation.messages) {
      console.log("💬 Konuşma başarıyla yüklendi:", conversation);
      setConversationInformation(conversation);
      console.log("💬 conversationInformation güncellendi:", conversation);

      const messages = conversation.messages || [];
      setConversationMessages(messages);
      console.log("💬 conversationMessages güncellendi:", messages);

      updateMessageBlock(messages);
    }
  }, [isConversationMemory, isSuccess, conversation]);

  // Yeni konuşma oluşturulduğunda
  useEffect(() => {
    if (!isConversationMemory && isSuccess && conversationCreated && createdConversationid) {
      console.log("💬 Yeni konuşma oluşturuldu:", createdConversationid);
      if (queuedMessage) {
        console.log("📨 Kuyruk mesajı gönderiliyor:", queuedMessage);
        dispatch(
          conversationSendMesaage({
            conversationid: createdConversationid,
            human_message: queuedMessage,
          })
        );
        setQueuedMessage(null);
        console.log("📨 queuedMessage sıfırlandı");
      } else {
        console.log("🧭 Yeni konuşmaya yönlendiriliyor:", createdConversationid);
        setConversationMessages([]);
        console.log("📨 conversationMessages sıfırlandı");
        updateMessageBlock([]);
        if (uiActions?.createNewConversation) {
          console.log("📬 createNewConversation tetiklendi:", createdConversationid);
          uiActions.createNewConversation(createdConversationid);
        }
      }
    }
  }, [
    isConversationMemory,
    isSuccess,
    conversationCreated,
    queuedMessage,
    createdConversationid,
    updateMessageBlock,
    uiActions,
  ]);

  const sendMessage = useCallback(
    (message, selectedProductid) => {
      console.log("📬 sendMessage çağrıldı, message:", message);
      console.log("📬 sendMessage çağrıldı, selectedProductid:", selectedProductid);
      console.log("📬 sendMessage çağrıldı, conversationid:", conversationid);

      setSelectedProduct(null);
      console.log("📬 selectedProduct sıfırlandı");

      if (conversationid) {
        console.log("📬 Mesaj gönderiliyor:", { conversationid, message, selectedProductid });
        dispatch(
          conversationSendMesaage({
            conversationid,
            human_message: message,
            productid: selectedProductid,
          })
        );
      } else {
        console.log("📬 conversationid yok, queuedMessage set ediliyor:", message);
        setQueuedMessage(message);
        dispatch(createconversation());
        console.log("📬 Yeni konuşma oluşturuluyor");
      }

      if (uiActions?.onPromptStart) {
        console.log("📬 onPromptStart tetiklendi");
        uiActions.onPromptStart();
      }
    },
    [conversationid, dispatch, uiActions]
  );

  const createNewConversation = useCallback(() => {
    console.log("🔄 createNewConversation çağrıldı");
    dispatch(createconversation());
    console.log("🔄 Yeni konuşma oluşturuluyor");

    if (uiActions?.onPromptStart) {
      console.log("🔄 onPromptStart tetiklendi");
      uiActions.onPromptStart();
    }
  }, [dispatch, uiActions]);

  const getConversationDetail = useCallback(
    (conversationid) => {
      console.log("📄 getConversationDetail çağrıldı, conversationid:", conversationid);
      handleSetConversation(conversationid);
    },
    []
  );

  const handleSetConversation = useCallback(
    (id) => {
      console.log("🧭 handleSetConversation çağrıldı, id:", id);
      if (id) {
        console.log("🧭 Var olan konuşma set ediliyor:", id);
        setConversationid(id);
        console.log("🧭 conversationid güncellendi:", id);
        dispatch(conversationDetail({ conversationid: id }));
      } else {
        console.log("🔄 Yeni konuşma başlatılıyor");
        dispatch(resetConversation());
        console.log("🔄 Konuşma sıfırlanıyor");
        dispatch(createconversation());
        console.log("🔄 Yeni konuşma oluşturuluyor");
        setConversationid(null);
        console.log("🧭 conversationid sıfırlandı");
      }
    },
    [dispatch]
  );

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