import React from 'react';
import { useState } from 'react';
import '../css/register.css';
import { withRouter, useLocation } from 'react-router';
import axios from 'axios';
import '../css/register.css';

function Register(props) {
    const location = useLocation();
    const userInfo = location.state.userInfo; //login에서 받아온 유저 정보
    const [newNickName, setNewNickName] = useState('');

    console.log(userInfo); //유저정보 출력 테스트

    function nickChange(e){
        setNewNickName(e.target.value);
    }

    const submitClickHandler = async() => {
        const response = await axios.post('http://localhost:8080/auth/nickname',{
            email: userInfo.email,
            nickName: newNickName
        });
        console.log(response.data.nickname);   
        userInfo.nickname = newNickName; // login 에서 받아온 userInfo에는 nickname 값이 공백이기 때문에, 닉네임 입력 후에는 다시 초기화해줘야함

        /* 메인으로 넘어가는 코드 필요 
            메인으로 넘어갈 때도 userInfo 들고가야함 
            userInfo 에서 nickname 값 출력하는 거까지 확인부탁합니당
        */

        props.history.push({
            pathname: "/main",
            state: {userInfo: userInfo}
        });

    }

    return (
        <div className = "container" >
        <div className = "logo" > 원터디 로고 </div> 
        <div>
            {userInfo.email}
        </div>
        <input type="text" placeholder="닉네임" className="inputNick" onChange={nickChange}></input>
        <button className="submitBtn" onClick={submitClickHandler}>저장</button>
        </div>
    )
}

export default withRouter(Register)