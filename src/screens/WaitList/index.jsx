import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../context/authContext";
import Header from "../../layouts/HeaderNoAuth";

import useAgentSocket from "../../hooks/useAgentSocket";
export default function WaitList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { connectSocket } = useAgentSocket()
  const { isLogin } = useAuth();
  return (
    <>
      <div className="content">
        Bekleme Listesi
      </div>
    </>
  );
}