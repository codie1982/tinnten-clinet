import { useState, useCallback } from "react";

export default function useChatManager() {
  const [groupedMessages, setGroupedMessages] = useState({});
  const [systemMessage, setSystemMessage] = useState(null);
  
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const groupMessagesByGroupId = (messages = []) => {
    return messages.reduce((groups, message) => {
      if (!groups[message.groupid]) groups[message.groupid] = [];
      groups[message.groupid].push(message);
      return groups;
    }, {});
  };

  const updateMessageBlock = useCallback((messages) => {
    const grouped = groupMessagesByGroupId(messages);
    const pages = Object.keys(grouped);
    const lastPage = pages.length;

    setGroupedMessages(grouped);
    setTotalCount(lastPage);
    setCurrentPage(lastPage);
    setSystemMessage(grouped[pages[lastPage - 1]] || []);
  }, []);

  const changePage = (page) => {
    if (page >= 1 && page <= totalCount) {
      setCurrentPage(page);
      const pages = Object.keys(groupedMessages);
      setSystemMessage(groupedMessages[pages[page - 1]] || []);
    }
  };

  return {
    groupedMessages,
    systemMessage,
    totalCount,
    currentPage,
    setSystemMessage,
    setTotalCount,       // 💡 Eklendi
    updateMessageBlock,
    changePage,
  };
}