import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../Context/AuthProvider";
import { Avatar, Button, Typography } from "antd";
import { styled } from "styled-components";

import { auth } from "../../firebaseConfig";

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  border-bottom: 1px solid #ccc;
  .username {
    color: white;
    margin-left: 5px;
  }
  > div {
    margin-bottom: 10px;
  }
`;

const UserInfo = () => {
  const {
    user: { displayName, photoURL },
  } = useContext(AuthContext);

  return (
    <WrapperStyled>
      <div>
        <Avatar src={photoURL}>
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className="username">{displayName}</Typography.Text>
      </div>
      <Button ghost onClick={() => auth.signOut()}>
        Đăng Xuất
      </Button>
    </WrapperStyled>
  );
};

export default UserInfo;
