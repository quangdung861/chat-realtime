import { Avatar, Button, Tooltip, Input, Form, Alert } from "antd";
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import { styled } from "styled-components";
import { UserAddOutlined } from "@ant-design/icons/lib/icons";
import Message from "./Message";
import { AppContext } from "../../Context/AppProvider";
import InviteMemberModal from "../Modals/InviteMemberModal";
import { addDocument } from "../../services";
import { AuthContext } from "../../Context/AuthProvider";
import useFirestore from "../../hooks/useFirestore";

import { formatRelative } from "date-fns";

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &__title {
      margin: 0;
      font-weight: bold;
    }
    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 11px;
`;

const FormStyled = styled(Form)`
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0px;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;
  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: calc(100% - 56px);
  overflow: hidden;
  overflow-y: auto;
`;

const ChatWindow = () => {
  const { roomSlected, selectedRoomId, members, setIsOpenInviteMemberModal } =
    useContext(AppContext);

  const condition = useMemo(
    () => ({
      fieldName: "roomId",
      operator: "==",
      compareValue: roomSlected.id,
    }),
    [roomSlected.id]
  );

  const params = {
    orderByName: "createdAt",
    orderByType: "asc",
  };

  const messages = useFirestore("messages", condition, params);

  const boxChatRef = useRef();

  const [currentRoomId, setCurrentRoomId] = useState(null);

  useEffect(() => {
    setCurrentRoomId(selectedRoomId);
  }, [messages]);

  useEffect(() => {
    const chatWindow = boxChatRef?.current;
    chatWindow?.scrollTo({
      top: chatWindow.scrollHeight,
    });
  }, [currentRoomId]);

  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);

  const [inputValue, setInputValue] = useState("");
  const [form] = Form.useForm();

  const inputRef = useRef();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = (e) => {
    if (inputValue) {
      addDocument("messages", {
        text: inputValue,
        uid,
        photoURL,
        roomId: roomSlected.id,
        displayName,
      });

      form.resetFields(["message"]);
      setInputValue("");

      // focus to input again after submit
      if (inputRef?.current) {
        setTimeout(() => {
          inputRef.current.focus();
        });
      }

      const chatWindow = boxChatRef?.current;
      chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: "auto"
      });
    }
  };

  const renderMembers = () => {
    return members.map((member) => {
      return (
        <Tooltip key={member.id} title={member.displayName}>
          <Avatar src={member.photoURL}>
            {!member.photoURL && member.displayName.charAt(0).toUpperCase()}
          </Avatar>
        </Tooltip>
      );
    });
  };

  return (
    <WrapperStyled>
      {roomSlected.id ? (
        <>
          <HeaderStyled>
            <div className="header__info">
              <p className="header__title">{roomSlected.name}</p>
              <span className="header__description">
                {roomSlected.description}
              </span>
            </div>
            <ButtonGroupStyled>
              <Button
                type="text"
                icons={<UserAddOutlined />}
                onClick={() => setIsOpenInviteMemberModal(true)}
              >
                Mời
              </Button>
              <Avatar.Group size="small" maxCount={2}>
                {renderMembers()}
              </Avatar.Group>
            </ButtonGroupStyled>
          </HeaderStyled>
          <InviteMemberModal />
          <ContentStyled>
            <MessageListStyled id="box-chat" ref={boxChatRef}>
              {messages.map((mes, index) => (
                <Message
                  key={mes.id}
                  text={mes.text}
                  photoURL={mes.photoURL}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                />
              ))}
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item className="input" name="message">
                <Input
                  ref={inputRef}
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder="Nhập tin nhắn..."
                  bordered={false}
                  autoComplete="off"
                />
              </Form.Item>
              <Button type="primary" onClick={handleOnSubmit}>
                Gửi
              </Button>
            </FormStyled>
          </ContentStyled>
        </>
      ) : (
        <Alert
          message="Hãy chọn phòng"
          type="info"
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
};

export default ChatWindow;
