import React, { useState, useContext, useMemo, useEffect } from "react";
import { Modal, Input, Form, Select, Spin, Avatar } from "antd";
import { AppContext } from "../../Context/AppProvider";
import { addDocument } from "../../services";
import { AuthContext } from "../../Context/AuthProvider";
import { debounce, set } from "lodash";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  where,
  limit,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);

      fetchOptions(value, props.curMembers).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {options?.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size="small" src={opt.photoURL}>
            {!opt.photoURL && opt.label.charAt(0).toUpperCase()}
          </Avatar>
          {`${opt.label}`}
        </Select.Option>
      ))}
    </Select>
  );
}

async function fetchUserList(search, curMembers) {
  let array = [];

  const dbRef = query(
    collection(db, "users"),
    where("keywords", "array-contains", search.toLowerCase())
  );

  const queryDocs = await getDocs(dbRef);

  queryDocs.forEach((doc) => {
    // Chấm thêm docs vẫn dc ?? query.docs.forEach...
    array.push({
      label: doc.data().displayName,
      value: doc.data().uid,
      photoURL: doc.data().photoURL,
    });
  });

  return array.filter((opt) => !curMembers.includes(opt.value));
}

const InviteMemberModal = () => {
  const {
    isOpenInviteMemberModal,
    setIsOpenInviteMemberModal,
    selectedRoomId,
    roomSlected,
  } = useContext(AppContext);

  const handleOk = async () => {
    // Update members in current room
    const dbRef = doc(db, "rooms", selectedRoomId); // Tham chiếu chứ ko có giá trị gì: sau đó xử lí bằng các method promise: getDoc, getDocs, setDoc ...

    await updateDoc(dbRef, {
      members: [...roomSlected.members, ...value.map((val) => val.value)],
    });

    setValue([])
    setIsOpenInviteMemberModal(false);
  };

  const handleCancel = () => {
    setIsOpenInviteMemberModal(false);
  };

  // const [keywords, setKeyword] = useState(null);
  // const [dataMemberKey, setDataMemberKey] = useState([]);

  // useEffect(() => {
  //   fetchUserList(keywords);
  // }, [keywords]);

  // const fetchUserList = async (keywords) => {
  //   setDataMemberKey([]);
  //   if (keywords !== null) {
  //     const collectionRef = query(
  //       collection(db, "users"),
  //       where("keywords", "array-contains", keywords?.toLowerCase())
  //     );

  //     const querySnapshot = await getDocs(collectionRef);

  //     let array = [];

  //     querySnapshot.forEach((doc) => {
  //       console.log(
  //         "🚀 ~ file: inviteMemberModal.js:88 ~ querySnapshot.forEach ~ doc:",
  //         doc
  //       );
  //       // Xử lý từng tài liệu được trả về
  //       array.push(doc.data());
  //     });
  //     setDataMemberKey(array);
  //   }
  // };

  // const renderMemberKeyWord = () => {
  //   return dataMemberKey.map((item) => {
  //     return <div key={item.uid}>{item.displayName}</div>;
  //   });
  // };

  const [value, setValue] = useState([]);
  const [form] = Form.useForm();

  return (
    <div>
      <Modal
        title="Thêm thành viên mới"
        open={isOpenInviteMemberModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <DebounceSelect
            mode="multiple"
            name="search-user"
            label="Tên các thành viên"
            value={value}
            placeholder="Nhập tên thành viên"
            fetchOptions={fetchUserList}
            onChange={(newValue) => setValue(newValue)}
            style={{ width: "100%" }}
            curMembers={roomSlected.members}
          />
        </Form>

        {/* <input onChange={(e) => setKeyword(e.target.value)} />
        <div style={{ position: "absolute", top: "50px", right: "50px" }}>
          {renderMemberKeyWord()}
        </div> */}
      </Modal>
    </div>
  );
};

export default InviteMemberModal;
