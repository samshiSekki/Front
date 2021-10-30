import React from 'react'
import { useState } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import '../css/login.css';
const {Kakao} = window;

function Login(props) {

    const [isLogin, setIsLogin] = useState(false)
    const [email, setEmail] = useState("default email")
    const [profileImage, setProfileImage] = useState("default profile img")
    const [accessToken, setAccessToken] = useState("default token")
    const [userInfo, setUserInfo] = useState({
        email:'',
        profileImage:'',
        accessToken:'',
        nickname:''
    })

    function LoginClickHandler(){
        try {
            return new Promise((resolve, reject) => {
                if (!Kakao) {
                    reject('kakao 인스턴트 없음');
                }
                Kakao.Auth.login({
                    success: (auth) => {
                        console.log('로그인 성공', auth);
                        const authData = auth;

                        /* 동일한 토큰이 오는지 확인 
                        if(Kakao.Auth.getAccessToken){
                            console.log(Kakao.Auth.getAccessToken());
                        }                        
                        */
                       
                        setIsLogin(true);
                        window.Kakao.API.request({
                            url:'/v2/user/me',
                            success: res =>{
                                const kakao_account = res.kakao_account;

                                const email = kakao_account.email;
                                const profileImage = kakao_account.profile.profile_image_url;
                                const accessToken = authData.access_token;

                                sendKakao(email, profileImage, accessToken);
                            }  
                        })
                    },

                    fail: (err) => {
                        console.log(err);
                    }
                })
            })
        } catch (err) {
            console.log(err);
        }
    }

    const sendKakao = async(email, profileImage, accessToken) => {
        setEmail(email);
        setProfileImage(profileImage);
        setAccessToken(accessToken);

        const response = await axios.post('http://localhost:8080/auth/kakao',{
            email: email,
            profileImage: profileImage,
            accessToken: accessToken
        })

        //register 에 넘어갈 user 정보
        userInfo.email = response.data.email;
        userInfo.profileImage = response.data.profileImage;
        userInfo.accessToken = response.data.accessToken;
        userInfo.nickname = response.data.nickname;
        // setEmail(response.data.email);

        console.log("login console");
        console.log(response);

        if(response.data.nickname===''){ // 닉네임이 없는 경우
            props.history.push({ // 닉네임 등록 화면으로
                pathname: "/register",
                state: {userInfo: userInfo}
                // state: {email : email}

            });
        }
        else{ // 닉네임 있는 경우 메인 화면으로 
            //console.log("main");

            /* 메인으로 넘어가는 코드 필요 
                메인으로 넘어갈 때도 userInfo 들고가야함 
                userInfo 에서 nickname 값 출력하는 거까지 확인부탁합니당
            */
            props.history.push({
                pathname: "/main_logged",
                state: {userInfo: userInfo}
            });
            
        }
    }

    return ( 
        <div className = "container" >
            <div className = "logo" > 원터디 로고 </div> 
            <button className = "loginButton" onClick = {LoginClickHandler} > 카카오로그인 </button> 
        </div>
        
    )
}

export default withRouter(Login)