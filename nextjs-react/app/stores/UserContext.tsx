'use client';
import {createContext, useContext, useState} from "react";

//유저 타입 지정
type UserType = any;

//Context 기본값 정의
//Context는 값 2개짜리 배열 [유저, 유저값을 바꾸는 함수]
const UserContext = createContext<[UserType, (user : UserType) => void]>([null, () => {}]);

//Provider 생성
//Children : 감쌀 컴포넌트들
export function UserProvider ({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<UserType>();
    return(
      <UserContext.Provider value={[user,setUser]}>
          {children}
      </UserContext.Provider>
    );
}

//꺼내쓰는 훅
export function useGlobalUser(){
    return useContext(UserContext);
}