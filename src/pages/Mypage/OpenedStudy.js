import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { withRouter, useLocation, useHistory } from 'react-router';
import NavbarWhite from '../Navbar/NavbarWhite';
import Footer from '../Footer/Footer';
import '../../css/mypageMore.css';

function OpenedStudy() {
    const location = useLocation();
    const userInfo = location.state.userInfo;
    let history = useHistory();
    const [openedList,setOpenedList]= useState(["",]);

    useEffect(async()=>{
        const response = await axios.get(`http://13.209.66.117:8080/users/${userInfo.userId}/opened-studylist`);
        console.log(response);
        setOpenedList(response.data);
    },[]);

    return (
        <>
          <NavbarWhite userInfo={userInfo}/>
          <img src="img/Group 477.png" className="openedStudyImg"/>
          <div className="myMorePageContainer">
            <div className="myMorePageBanner">
              <div className="myMorePageTitleText">
                <p>🚀 개설한 스터디 <br/>{userInfo.nickname}님이 개설한 스터디에 신청한 신청서 목록입니다.</p>
                
              </div>
            </div>

            {
                (openedList[0] != "" && openedList.msg != "개설한 스터디가 없습니다")
                ? openedList.map((a,i)=>{
                    return <OpenedList openedList = {openedList[i]} i={i} userInfo={userInfo}/>
                })
                : "개설한 스터디가 없습니다"
            }

            
            </div>
            <Footer/>
        </>
    )
}

function OpenedList(props){
    let history = useHistory();

    const startStudyBtnClickHandler = async() => {
        console.log(props.userInfo.userId);
        console.log(props.openedList.study.StudyId);
        const response = await axios.put(`http://13.209.66.117:8080/users/${props.userInfo.userId}/opened-studylist/${props.openedList.study.StudyId}`);
        window.location.reload();
    }

    console.log(props.openedList.applications);

    return(
        <>
            <div className="openedListContainer">
                <div className="openedStudyTitle">
                    {props.openedList.study.studyName}
                </div>
                <br/>
                
                <br/>
                {
                    props.openedList.applications[0] != null
                    ?props.openedList.applications.map((a,j)=>{
                        return <ReceivedAppList applications = {props.openedList.applications[j]} j={j} userInfo={props.userInfo} studyId={props.openedList.study.StudyId}/>
                    })
                    :null
                }
                {
                    props.openedList.study.state == 0
                    ?<div onClick={startStudyBtnClickHandler} className="startStudyBtn">스터디 시작하기</div>
                    :<div className="openedStudyStartedMsg">스터디가 시작되었습니다<br/>참여 스터디 페이지에서 스터디를 확인하고, 관리하세요.</div>
                }
            </div>
        </>
    )
}

function ReceivedAppList(props){
    const [modal, setModal] = useState(false);
    let history = useHistory();
    //console.log(props.applications.state);

    function receivedAppViewDetailClickListner(){
        history.push({
            pathname: `/received_app`,
            state: {userInfo: props.userInfo, applications: props.applications, studyId:props.studyId}
          })
    }

    return(
        <>

            <div className = "receivedAppContainer">
                <div className="receivedAppUserName">{props.applications.application.name}</div>
            
                <div className="fireEmoji">
                    🔥
                </div>
                <div className = "receivedAppUserTemp">
                    {props.applications.temperature}°C
                </div>
                
                <div className="receivedAppViewDetail" onClick={receivedAppViewDetailClickListner}>
                    상세보기
                </div>
                <div className="receivedAppRegDate">
                    {props.applications.registered.substr(0,10)} 등록
                </div>

                <div className="receivedAppRegDate">
                    {
                        props.applications.state == 0
                        ? "대기중"
                        : props.applications.state == 1
                            ? "수락함"
                            : "거절함"
                    }
                </div>
            </div>

            
            {/*
            <div>
                {props.applications.application.name}
            </div>
            <div>
                {props.applications.temperature}
            </div>
            <div>
                {
                    (props.applications.state == 0)
                    ? "대기중"
                    : (props.applications.state == 1
                        ? "수락됨"
                        : "거절됨")
                }
            </div>
            <button onClick={()=>{setModal(!modal)}}>상세보기</button>
            {
                modal === true
                ?<Modal apps = {props.applications} studyId={props.studyId}/>
                :null
            }
            */}
        </>
    )
}
/*
function Modal(props){
    const [declineModal, setDeclineModal] = useState(false);

    const acceptBtnClickHandler = async() => {
        const response = await axios.put(`http://13.209.66.117:8080/users/${props.apps.application.userId}/opened-studylist/manageMember/${props.apps.application.applicationId}`,{
            choice: "수락",
            studyId: props.studyId
        });
        
        window.location.reload();
    }

    const declineBtnClickHandler = async() => {
        const response = await axios.put(`http://13.209.66.117:8080/users/${props.apps.application.userId}/opened-studylist/manageMember/${props.apps.application.applicationId}`,{
            choice: "거절",
            studyId: props.studyId
        });
        
        window.location.reload();
    }

    return(
        <div>
            <div className="modalContainer">
                {`이름 : ${props.apps.application.name}`} <br/>
                {`나이 : ${props.apps.application.age}`} <br/>
                {`학교 : ${props.apps.application.school}`} <br/>

                <button onClick={acceptBtnClickHandler}>수락하기</button>
                <button onClick={()=>{setDeclineModal(!declineModal)}}>거절하기</button>
                <button>채팅</button>
                <br/>
                {
                    declineModal === true
                    ?<DeclineModal/>
                    :null
                }
                <br/>
                <button onClick={declineBtnClickHandler}>거절 확인</button>
                <button>거절 취소</button>
            </div>
        </div>
    )
}

function DeclineModal(props){

    return(
        <>
            <button>시간대가 맞지 않음</button>
            <button>추구하는 스터디 목적이 다름</button>
            <button>거주 지역이 너무 멂</button>
            <button>선착순 인원 초과</button>
            <button>기타</button>
        </>
    )
}*/

export default withRouter(OpenedStudy)
