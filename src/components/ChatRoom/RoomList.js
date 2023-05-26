import React, { useState, useContext, useMemo } from "react";
import { Button, Collapse, Typography } from "antd";
import { styled } from "styled-components";
import { PlusSquareOutlined } from "@ant-design/icons";
import useFirestore from "../../hooks/useFirestore";
import { AuthContext } from "../../Context/AuthProvider";
import { AppContext } from "../../Context/AppProvider";
import AddRoomModal from "../Modals/AddRoomModal";

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
    }
    .ant-collapse-content-box {
      padding: 0 40px;
    }
  }
  .add-room {
    color: white;
    padding: 0;
  }
`;

const LinkStyled = styled(Typography.Link)`
  &&& {
    display: block;
    margin-bottom: 5px;
    color: white;
  }
`;

const RoomList = () => {
  const { rooms, setIsModalOpen, setSelectedRoomId } = useContext(AppContext);
  console.log("🚀 ~ file: RoomList.js:38 ~ RoomList ~ rooms:", rooms)

  return (
    <Collapse ghost defaultActiveKey={["1"]}>
      <PanelStyled header="Danh sách các phòng" key="1">
        {rooms?.map((room) => (
          <LinkStyled key={room.id} onClick={() => setSelectedRoomId(room.id)}>
            {room.name}
          </LinkStyled>
        ))}
        <Button
          type="text"
          icon={<PlusSquareOutlined />}
          className="add-room"
          onClick={() => setIsModalOpen(true)}
        >
          Thêm phòng
        </Button>
        <AddRoomModal />
      </PanelStyled>
    </Collapse>
  );
};

export default RoomList;
