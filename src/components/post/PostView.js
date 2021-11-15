import React, { useState,useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Card, message, Popconfirm,Alert,Modal,Button,Radio} from 'antd';
import usePostDetail from '../../hooks/usePostDetail';
import axios from 'axios';
import {
  postDelete,registerPost
} from '../functions/postFunctions'
import useErrorHandling from '../../hooks/useErrorHandling';

// 상세 게시글 보기
// 게시글 내용 불러오기 ->
function PostView({ match, history, location }) {
  
  const userId = location.state.userInfo.userId;
  console.log(userId)
  const studyId = match.params.id;
  const [postDetail,setPostDetail] = useState([]);
  const errorHandling = useErrorHandling();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [registerList, setRegisterList]=useState([]);
  const [isButtonVisible, setIstButtonVisible] = useState(true);

  const [isListVisible, setIsListVisible] = useState(false);
  const [selectList, setSelectList] = useState();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

/*   async function fetchData(){
    postDetaill = await axios.get(`http://13.209.66.117:8080/studylist/${studyId}`
    ,{
      params: {
        StudyId: studyId
      }});
      setPostDetail(postDetaill.data.data)
      
    }
    
    
  
  useEffect(() => {
    
    fetchData();
      console.log(postDetail)

  }, [])   */
  /*  axios.get(`http://13.209.66.117:8080/studylist/${studyId}`, {
      params: {
        studyId : studyId
      }
    })
    .then(res =>setPostDetail(res.data))
    .catch(err => console.log(err));  */

  useEffect(() => {
    console.log(studyId);
    axios.get(`http://13.209.66.117:8080/studylist/${studyId}`, {
      params: {
        studyId : studyId
      }
    })
    .then(res =>setPostDetail(res.data.data))
    .catch(err => console.log(err));
    console.log(postDetail)

  }, []);

  const onDelete = () =>{
    if (postDetail.userId === userId) {
      postDelete(studyId)
      .then(() => {
        message.success('게시글 삭제가 완료되었습니다.');
        history.goBack();
      })
      .catch((error) => {
        errorHandling(error.response.data.message);
      });
    }
    else {
      <Alert message="삭제할 권한이 없습니다." type="error" showIcon />

    }
  
    }

    const onUpdate = () =>{
      if (postDetail.userId === userId) {
        history.push({
          pathname: `${postDetail.StudyId}/update`,
          state: {id: postDetail.StudyId}
        })
      }
      else {
        <Alert message="수정할 권한이 없습니다." type="error" showIcon />
  
      }
    }

    const onRegister=()=>{
      setIstButtonVisible(false);
      setIsListVisible(!isListVisible);
      console.log(userId)
      axios.get(`http://13.209.66.117:8080/users/${userId}/application`, {
        params: {
          userId : userId,
        }
      })
      .then(res =>setRegisterList(res.data))
      .catch(err => console.log(err));
      console.log(registerList)

    }
    
    const handleSelet=(li)=>{
      if (selectList ==  null) {
        setSelectList(li.applicationId)
      }
      
    }
    
    const handleRegister=()=>{
      console.log(selectList)
      let body = {
        "userId": userId,
  "applicationId": selectList,
      }

      registerPost(studyId, body)
      .then(() => {
        history.goBack();
        message.success('신청 완료!');
      })
      .catch((error) => {
        errorHandling(error.response?.data.message);
      });
    }


  return (
    <>
        <div>
          <div>
            <Card title={insideCard()}>
              {postBox()}
            </Card>
          </div>
        </div>{' '}
    </>
  );
  function postBox() {
    return (
      <>
        <div
          style={{ padding: 10 }}
          dangerouslySetInnerHTML={{ __html: postDetail.content }}
          className="board-content"
        />
        <div>
          <div style={{ fontSize: '12px' }}>
            <div>
              <Popconfirm
                title="정말로 게시글을 삭제하시겠습니까?"
                onConfirm={onDelete}
                okText="Yes"
                cancelText="No"
              >
                <span
                  style={{
                    cursor: 'pointer',
                    // float: 'left',
                    marginRight: '12px',
                  }}
                >
                  삭제
                </span>
              </Popconfirm>
              <button onClick={onUpdate} >수정</button>
              <button onClick={showModal} >신청 하기</button>
              <Modal title="Basic Modal" visible={isModalVisible} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}>
        <p>해당 스터디를 신청하시겠습니까?</p>{isButtonVisible? (<><button onClick={onRegister}>예</button><button onClick={handleCancel}>아니요</button></>):<div></div>}
        <div>{isListVisible ? (registerList.map((li)=>showRegisterList(li))) : <div></div>}</div>
        <div>{isListVisible ? (<><button onClick={handleRegister}>신청</button></>):<div></div>}</div>
      </Modal>
                {/* <Link to={`${postDetail.StudyId}/update`}>
                  <span>수정</span>
                </Link> */}
            </div>
          </div>{' '}
        </div>
        <div>
          <hr />
        </div>
      </>
    );
  }
  function showRegisterList(li){
    let arr = []
    console.log(li)
   if (registerList[0].applicationId == li.applicationId) {


    arr.push(<><input type="radio" value={li.applicationId} onClick={selectList == null ? setSelectList(li.applicationId):null}></input><label>대표 지원서 : {li.applicationId}</label></>)

   }
   else{
    arr.push(<><input type="radio" value={li.applicationId} onClick={selectList == null ? setSelectList(li.applicationId):null}></input><label>{li.applicationId}</label></>)
   }
   return arr;
  }
  function insideCard() {
    return (
      <>
        <div
          style={{
            display: 'inline-block',
            width: '100%',
            fontWeight: 'bold',
            fontSize: '22px',
            wordBreak: 'break-word',
            whiteSpace: 'pre-line',
            overflowWrap: 'break-word',
          }}
        >
          <p>{postDetail.studyName}</p>
        </div>
        <div>
          {postDetail.userId === null ? (
            <span style={{ fontSize: '8px' }}> 탈퇴한 사용자 </span>
          ) : (
            <span style={{ fontSize: '13px' }}>
              {postDetail.userId}{' '}
            </span>
          )}
        </div>
        <div>
        <span style={{ marginLeft: '24px', fontSize: '12px' }}>
            분야 : {postDetail.category}
          </span>
          <span style={{ marginLeft: '24px', fontSize: '12px' }}>
            상세 설명 : {postDetail.description}
          </span>
        </div>
        <div>
        <span style={{ marginLeft: '24px', fontSize: '12px' }}>
            진행 방식 : {postDetail.onoff}
          </span>
          <span style={{ marginLeft: '24px', fontSize: '12px' }}>
            희망 시간대 : {postDetail.studyTime}
          </span>
        </div>
        <div>
          <span style={{ marginLeft: '24px', fontSize: '12px' }}>
            신청서 필수 열람사항 : {postDetail.requiredInfo}
          </span>
        </div>
        <div>
          <span style={{ marginLeft: '24px', fontSize: '12px' }}>
            모집 인원 : {postDetail.peopleNum}
          </span>
        </div>
      </>
    );
  }
}

export default withRouter(PostView);
