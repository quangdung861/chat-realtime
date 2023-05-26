import React, { useContext, useState } from "react";
import { Modal, Input, Form } from "antd";
import { AppContext } from "../../Context/AppProvider";
import { addDocument } from "../../services";
import { AuthContext } from "../../Context/AuthProvider";

const AddRoomModal = () => {
  const { isModalOpen, setIsModalOpen } = useContext(AppContext);
  const {
    user: { uid },
  } = useContext(AuthContext);

  const [addRoomForm] = Form.useForm();

  const handleOk = () => {
    console.log(addRoomForm.getFieldsValue());

    const addRoomData = addRoomForm.getFieldsValue();

    addDocument("rooms", {
      ...addRoomData,
      members: [uid],
    });

    addRoomForm.resetFields();

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    addRoomForm.resetFields();
    setIsModalOpen(false);
  };

  return (
    <div>
      <Modal
        title="Tạo phòng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={addRoomForm} layout="vertical">
          <Form.Item label="Tên phòng" name="name">
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea placeholder="Nhập mô tả" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddRoomModal;
