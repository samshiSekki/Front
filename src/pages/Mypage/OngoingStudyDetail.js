import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { withRouter, useLocation, useHistory } from 'react-router';
import NavbarWhite from '../Navbar/NavbarWhite';
import Footer from '../Footer/Footer';
import '../../css/mypageMore.css';

function OngoingStudyDetail() {
    const location = useLocation();
    const userInfo = location.state.userInfo;
    const ongoingStudy = location.state.ongoingStudy;
    const isManager = location.state.isManager;
    const history = useHistory();

    const [common, setCommon] = useState([]);

    console.log(ongoingStudy);
    console.log(isManager);

    useEffect(async()=>{
        let response = await axios.get(`http://13.209.66.117:8080/studyList/${ongoingStudy.studyInfo.StudyId}`);
        console.log(response);
        setCommon(response.data.data.commonSchedule);
        console.log(common);
    },[]);

    function scheduleBtnClickHandler(){
        history.push({ 
            pathname: "/schedule",
            state: {userInfo: userInfo, isManager: isManager, ongoingStudy: ongoingStudy}
          });
    }

    function showSchedule(){
        let commonText = ''
        if(common[0] == null){
            return `스터디 일정이 아직 확정되지 않았습니다`
        }
        else{
            for(let i=0; i<common.length; i++){
                commonText = commonText + `매주 ${common[i][0]} ${common[i][1]} - ${parseInt(common[i][common[i].length-1])+1}\n`
            }
            return commonText
        }
    }

    return (
        <div>
            <NavbarWhite userInfo={userInfo}/>
            <div className="myMorePageContainer">
                <div className="ongoingStudyDetailTitle">
                    {ongoingStudy.studyInfo.studyName}
                </div>
                <div className="participantsPics">
                    <div className="participantsPicsContainer">
                    {
                        ongoingStudy.participants.map((a,i)=>{
                            if(ongoingStudy.participants[i].userId == ongoingStudy.studyInfo.userId){
                                return (
                                    <>
                                    <img src="img/Group 420.png" className="managerLabelImg"/>
                                    <img src={ongoingStudy.participants[i].profileImage} className="participantsProfileImg"/>
                                    </>
                                )
                            }
                            else{
                                return <img src={ongoingStudy.participants[i].profileImage} className="participantsProfileImg"/>
                            }
                        })
                    }
                    </div>
                </div>
                <div className="ongoingDetailContainers">
                    <div className="ongoingSubTitle">📆 스터디 일정</div>

                    <div className="scheduleBox">
                    {showSchedule()}<br/>
                    <div className="scheduleAdjustBtn" onClick={scheduleBtnClickHandler}>일정 조율하기</div>
                    </div>
                </div>

                <div className="ongoingDetailContainers">
                    <div className="ongoingSubTitle">✍ 해야할 과제</div>

                    <div className="subjectTodoBox">
                    
                    </div>
                </div>
                {
                    isManager == 1
                    ? (
                        <div className="ongoingDetailContainers">
                        <div className="ongoingSubTitle">📂 관리할 과제</div>

                        <div className="subjectTodoBox">
                    
                        </div>
                        </div>
                    )
                    : null
                }

                <div className="ongoingDetailContainers">
                    <div className="ongoingSubTitle">🔥 상호 열정 평가</div>

                    <div className="scheduleBox">
                    스터디가 종료되어 하단의 스터디 종료 버튼을 누르면<br/> 상단의 스터디원 프로필을 통해 열정 평가가 진행됩니다.<br/>
                    <div className="scheduleAdjustBtn">스터디 종료하기</div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default OngoingStudyDetail
