import React, { createContext, useContext, useMemo, useState } from "react";
import { AuthContext } from "./AuthProvider";
import useFirestore from "../hooks/useFirestore";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [isOpenInviteMemberModal, setIsOpenInviteMemberModal] = useState(false);
  const {
    user: { uid },
  } = useContext(AuthContext);

  const roomCondition = useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: uid,
    };
  }, [uid]);

  const rooms = useFirestore("rooms", roomCondition);

  const roomSlected = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) || {},
    [rooms, selectedRoomId]
  );

  const usersCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: roomSlected.members,
    };
  }, [roomSlected.members]);

  const members = useFirestore("users", usersCondition);

  return (
    <AppContext.Provider
      value={{
        rooms,
        setIsModalOpen,
        isModalOpen,
        setSelectedRoomId,
        selectedRoomId,
        roomSlected,
        members,
        isOpenInviteMemberModal,
        setIsOpenInviteMemberModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
