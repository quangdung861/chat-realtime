import React from "react";
import { Row, Col, Button, Typography } from "antd";

import { signInWithPopup, getAdditionalUserInfo } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../../firebaseConfig";
import { addDocument, generateKeywords } from "../../services";

const { Title } = Typography;

const Login = () => {
  const handleGoogleSignIn = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    if (data) {
      const { isNewUser } = getAdditionalUserInfo(data);
      console.log(isNewUser);
      if (isNewUser) {
        addDocument("users", {
          displayName: data.user.displayName,
          email: data.user.email,
          photoURL: data.user.photoURL,
          uid: data.user.uid,
          providerId: data.providerId,
          keywords: generateKeywords(data.user.displayName.toLowerCase()),
        });
      }
    }
  };

  const handleFacebookSignIn = async () => {
    const data = await signInWithPopup(auth, facebookProvider);
    if (data) {
      const { isNewUser } = getAdditionalUserInfo(data);
      console.log(isNewUser);
      if (isNewUser) {
        addDocument("users", {
          displayName: data.user.displayName,
          email: data.user.email,
          photoURL: data.user.photoURL,
          uid: data.user.uid,
          providerId: data.providerId,
          keywords: generateKeywords(data.user.displayName.toLowerCase()),
        });
      }
    }
  };

  return (
    <Row justify="center" style={{ height: "800px" }}>
      <Col span={8}>
        <Title style={{ textAlign: "center" }} level={3}>
          Fun Chat
        </Title>
        <Button
          style={{ width: "100%", marginBottom: 5 }}
          onClick={handleGoogleSignIn}
        >
          Đăng nhập bằng Google
        </Button>
        <Button
          style={{ width: "100%", marginBottom: 5 }}
          onClick={handleFacebookSignIn}
        >
          Đăng nhập bằng Facebook
        </Button>
      </Col>
    </Row>
  );
};

export default Login;
