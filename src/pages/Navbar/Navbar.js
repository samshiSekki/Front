import React from 'react';
import '../../css/navbar.css';
import { useLocation } from 'react-router';
import { withRouter, useHistory } from 'react-router-dom';

const {Kakao} = window;

function Navbar(props) {
    return (
        <div>
            {props.userInfo.nickname === ''
            ? <LoggedOut userInfo={props.userInfo}/>
            : <LoggedIn userInfo={props.userInfo}/>
            }
        </div>
    )
}

function LoggedOut(props){
    let history = useHistory();

    function logoClickHandler(){
        history.push('/main');
    }

    return(
    <div>
        <div className="navbar">
        <div className="logo" onClick={logoClickHandler}>wantudy</div>
        <div className="join">스터디 참여</div>
        <div className="make">스터디 개설</div>
        <div className="apply">스터디 신청서 등록</div>
        <div className="login" onClick={()=>{history.push("/login")}}>로그인</div>
        <div className="register" onClick={()=>{history.push("/login")}}>회원가입</div>
        </div>
    </div>
    );
}

function LoggedIn(props){
    let history = useHistory();

    function LogoutClickHandler(){
        if (Kakao.Auth.getAccessToken()) {
            console.log(
              '카카오 인증 액세스 토큰이 존재합니다.',
              Kakao.Auth.getAccessToken(),
            );
            Kakao.Auth.logout(() => {
              console.log('로그아웃 되었습니다.', Kakao.Auth.getAccessToken());
              alert('로그아웃 되었습니다.');
              localStorage.clear();
              history.push("/main");
            });
          }
    }

    function logoClickHandler(){
        history.push({
            pathname: "/main_logged",
            state: {userInfo: props.userInfo}
        });
    }

    return(
        <div className="navbar">
        <div className="logo" onClick={logoClickHandler}>wantudy</div>
        <div className="join">스터디 참여</div>
        <div className="make">스터디 개설</div>
        <div className="apply">스터디 신청서 등록</div>
        <div className="nickname">안녕, {props.userInfo.nickname}</div>
        <div className="logout" onClick={LogoutClickHandler}>로그아웃</div>
        </div>
    )
}

export default withRouter(Navbar)
