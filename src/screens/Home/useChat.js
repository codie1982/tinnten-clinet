import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAgentSocket from "../../hooks/useAgentSocket";
// Aşağıdaki aksiyon creator’ları ve constant’ler projenizde import edilmelidir.
import { conversationDetail, conversationSendMesaage, resetConversation, createconversation } from "../../api/conversation/conversationSlicer";

import { RECOMMENDATOINVIEW, DETAILVIEW, QUESTIONVIEW } from "../../constant/chatContentConstant";

export default function useChat(uiActions, initialConversationId = null) {
  // Chat yönetimi için yerel state'ler (mesajlar, sayfalama, viewAction, seçilen ürün)
  const [groupedMessages, setGroupedMessages] = useState({});
  const { currentIntent, message: preMessage } = useAgentSocket();
  const [systemMessage, setSystemMessage] = useState(null);
  const [completeMessage, setCompleteMessage] = useState("")
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewAction, setViewAction] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [conversationInformation, setConversationInformation] = useState()
  const [conversationMessages, setConversationMessages] = useState()
  // Ürün bilgisini Redux'dan çekiyoruz
  const { isProductLoading, isProcudtSuccess, isProductError, productData } = useSelector(
    (state) => state.product
  );

  // Konuşma bilgilerini Redux'dan çekiyoruz
  const {
    isSuccess,
    isLoading,
    conversation,
    conversationCreated,
    conversationid: createdConversationid,
    conversationNewMessage,
  } = useSelector((state) => state.conversation);


  const [_conversationMessage, setConversationMessage] = useState([
    { human_message: "İnsan mesaj1 ", system_message: "AI mesaj1" },
    { human_message: "İnsan mesaj2 ", system_message: "AI mesaj2" },
  ])



  // Konuşma (conversation) yönetimi için yerel state'ler
  const [conversationid, setConversationid] = useState(initialConversationId);
  const [queuedMessage, setQueuedMessage] = useState(null);

  // Dispatch, navigate ve Redux state'leri
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ürün bilgisini Redux'dan çekiyoruz
  const { stream } = useSelector(
    (state) => state.stream
  );

  useEffect(() => {
    if (conversationNewMessage != null && conversationMessages) {
      console.log(
        "conversationNewMessage",
        conversationNewMessage.human_message,
        conversationNewMessage.system_message,
        conversationMessages
      );

      // Yeni bir messages dizisi oluştur
      const updatedMessages = [
        ...conversationMessages,
        conversationNewMessage.human_message,
        conversationNewMessage.system_message,
      ];
      setConversationMessages(updatedMessages);
    }
  }, [conversationNewMessage]);


  useEffect(() => {
    console.log("currentIntent", currentIntent)
    if (!currentIntent) {
      switch (currentIntent) {
        case "chat":
        case "recommendation":
          setViewAction(RECOMMENDATOINVIEW);
          break;
        case "production_info":
        case "services_info":
          setViewAction(DETAILVIEW);
          break;
      }
    }
  }, [currentIntent])



  useEffect(() => {
    if (stream != "") setCompleteMessage(prev => prev + stream)
  }, [stream])


  useEffect(() => {
    console.log("completeMessage", completeMessage);

    if (
      completeMessage &&
      conversation &&
      Array.isArray(conversationMessages) &&
      conversationMessages.length > 0
    ) {
      // Yeni bir conversationMessages dizisi oluştur
      const updatedMessages = [...conversationMessages];
      updatedMessages[updatedMessages.length - 1] = {
        ...updatedMessages[updatedMessages.length - 1],
        content: completeMessage,
      };

      // State'i güncelle
      setConversationMessages(updatedMessages);

      // updateMessageBlock'u yeni diziyi kullanarak çağır
      updateMessageBlock(updatedMessages);
    }
  }, [completeMessage, conversation, conversationMessages, setConversationMessages, updateMessageBlock]);


  // Eğer başlangıçta bir conversation id verilmişse ilgili detayları getiriyoruz
  useEffect(() => {
    if (initialConversationId) {
      dispatch(conversationDetail({ conversationid: initialConversationId }));
      console.log("useChat: Fetched conversation details for initialConversationId:", initialConversationId);
    }
  }, [initialConversationId, dispatch]);

  // Ürün başarıyla yüklendiğinde, seçilen ürünü ve viewAction'ı güncelliyoruz
  useEffect(() => {
    if (isProcudtSuccess && !isProductLoading && !isProductError) {
      // Ürün detay görünümü için viewAction'ı DETAILVIEW olarak ayarlıyoruz
      handleViewAction(DETAILVIEW);
      setSelectedProduct(productData);
      if (uiActions?.onProductSelected) uiActions.onProductSelected();
    }
  }, [isProductLoading, isProcudtSuccess, isProductError, productData]);

  useEffect(() => {
    if (uiActions?.onUpdateActionView) uiActions.onUpdateActionView(viewAction);
  }, [viewAction])

  // Gelen mesaj listesini gruplamak için yardımcı fonksiyon
  const groupMessagesByGroupId = (messages = []) => {
    const groups = messages.reduce((groups, message) => {
      if (!groups[message.groupid]) groups[message.groupid] = [];
      groups[message.groupid].push(message);
      return groups;
    }, {});
    console.log("useChat: groupMessagesByGroupId() output:", groups);
    return groups;
  };

  // Yeni mesajlar geldiğinde mesaj bloğunu güncelleyen fonksiyon
  const updateMessageBlock = useCallback((messages) => {
    const grouped = groupMessagesByGroupId(messages);
    console.log("useChat: Grouped messages:", grouped);
    const pages = Object.keys(grouped);
    const lastPage = pages.length;
    console.log("useChat: Total pages:", lastPage, "Pages:", pages);

    setGroupedMessages(grouped);
    setTotalCount(lastPage);
    setCurrentPage(lastPage);

    const latestSystemMessage = grouped[pages[lastPage - 1]] || [];
    console.log("useChat: Latest system message:", latestSystemMessage);

    let action =
      latestSystemMessage[1]?.type === "system_message" ? latestSystemMessage[1].action : "";
    console.log("useChat: Determined action:", action);

    if (action === RECOMMENDATOINVIEW) {
      setViewAction(RECOMMENDATOINVIEW);
    } else if (action === QUESTIONVIEW) {
      setViewAction(QUESTIONVIEW);
    } else if (action === DETAILVIEW) {
      setViewAction(DETAILVIEW);
    } else {
      setViewAction(RECOMMENDATOINVIEW);
    }
    setSystemMessage(latestSystemMessage);
  }, []);

  // viewAction'ı güncelleyen yardımcı fonksiyon
  const handleViewAction = (action) => {
    let _action = action;
    if (!_action && systemMessage && systemMessage[1]) {
      _action = systemMessage[1].action;
    }
    console.log("handleViewAction", systemMessage, _action)
    switch (_action) {
      case RECOMMENDATOINVIEW:
        setViewAction(RECOMMENDATOINVIEW);
        break;
      case QUESTIONVIEW:
        setViewAction(QUESTIONVIEW);
        break;
      case DETAILVIEW:
        setViewAction(DETAILVIEW);
        break;
      default:
        setViewAction(RECOMMENDATOINVIEW);
        break;
    }
  };

  // Sayfa değiştirme fonksiyonu
  const changePage = (page) => {
    if (page >= 1 && page <= totalCount) {
      setCurrentPage(page);
      const pages = Object.keys(groupedMessages);
      setSystemMessage(groupedMessages[pages[page - 1]] || []);
    }
  };

  // Konuşma state'i değiştiğinde mesajları güncelle
  useEffect(() => {
    if (!isLoading && isSuccess && conversation) {
      console.log("useChat: Received conversation from Redux:", conversation);
      setConversationInformation(conversation);
      setConversationMessage(conversation.messages);
      updateMessageBlock(conversation.messages);
    }
  }, [isLoading, isSuccess, conversation]);

  useEffect(() => {
    console.log("conversationMessages:", conversationMessages);
    if (conversationMessages) {
      updateMessageBlock(conversationMessages);
    }
  }, [conversationMessages]);


  // Eğer konuşma oluşturulmuş ve kuyruktaki mesaj varsa,
  // bu mesajı ilgili conversation id ile dispatch ediyoruz
  useEffect(() => {
    if (!isLoading && isSuccess && conversationCreated && queuedMessage) {
      console.log("useChat: Conversation created. Dispatching queued message:", queuedMessage);
      dispatch(conversationSendMesaage({ conversationid: createdConversationid, human_message: queuedMessage }));
      setQueuedMessage(null);
      navigate("/conversation" + "/" + createdConversationid)
    }
  }, [isLoading, isSuccess, conversationCreated, queuedMessage, createdConversationid, dispatch]);

  // Kullanıcının gönderdiği mesajı işleme koyan fonksiyon
  const sendMessage = (message) => {
    console.log("useChat: onPromptStart callback triggered. Message to send:", message);
    if (uiActions?.onPromptStart) uiActions.onPromptStart();
    // Ürün seçimi sıfırlanıyor (örneğin yeniden seçim yapılması için)
    setSelectedProduct(null);
    if (conversationid) {
      dispatch(conversationSendMesaage({ conversationid, human_message: message }));
      console.log("useChat: Sent prompt for existing conversation:", conversationid);
    } else {
      setQueuedMessage(message);
      dispatch(createconversation());
      console.log("useChat: Queueing message and creating new conversation.");
    }
  };

  // Konuşmayı set etme veya yeniden başlatma fonksiyonu
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
    // Chat manager verileri
    groupedMessages,
    systemMessage,
    totalCount,
    currentPage,
    viewAction,
    selectedProduct,
    setSelectedProduct,
    setSystemMessage,
    handleViewAction,
    setTotalCount,
    updateMessageBlock,
    changePage,
    // Konuşma akışına dair fonksiyonlar
    sendMessage,
    handleSetConversation,
    conversationid,
    setConversationid,
  };
}
