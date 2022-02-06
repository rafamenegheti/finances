import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import { Alert } from 'react-native';


const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;


interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string,
    name: string,
    email: string,
    photo?: string
}

interface IAuthContextData {
    user: User;
    handleSignInWithGoogle: () => Promise<void>;
    handleSignInWithApple: () => Promise<void>;
    signOut: () => Promise<void>;
    userStorageLoading: boolean;
    isLoginLoading: boolean
}

interface AuthorizationResponse {
    params: {
        access_token: string,
    };
    type: string;
}

const AuthContext = createContext({} as IAuthContextData);

if (!AuthContext) {
    throw new Error('useAuth must be used inside AuthProvider');
}

function AuthProvider({ children }: AuthProviderProps) {



    const [user, setUser] = useState<User>({} as User);
    const [userStorageLoading, setUserStorageLoading] = useState(true);
    const [isLoginLoading, setIsLoginLoading] = useState(false)

    const userStorageKey = '@gofinances:user'

    async function signInWithGoogle() {
        try {
            const RESPONSE_TYPE = "token";
            const SCOPE = encodeURI("profile email");

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`

            const { type, params } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse

            if (type === 'success') {
                const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${params.access_token}`)
                const userInfo = await response.json();

                const userLoged = {
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.given_name,
                    photo: userInfo.picture
                }

                setUser(userLoged)
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLoged))

            }


        } catch (err: any) {
            console.log("New error at src/hooks/auth:signInWithGoogle --- " + err)
            throw new Error(err)
        }
    }

    async function handleSignInWithGoogle() {
        try {
            setIsLoginLoading(true)
            return await signInWithGoogle();
            
        } catch (err) {
            console.log("New error at src/hooks/auth:handleSignInWithGoogle --- " + err)
            Alert.alert("Não foi possível conectar a conta Google")
        } finally {
            setIsLoginLoading(false)
        }
    }

    async function signInWithApple() {
        try {

            const credentials = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            })

            if (credentials) {
                const name = credentials.fullName!.givenName!;
                const photo = `https://ui-avatars.com/api?name=${name}&length=1`
                const userLoged = {
                    id: String(credentials.user),
                    email: credentials.email!,
                    name,
                    photo,
                }

                setUser(userLoged);
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLoged))
            }



        } catch (err: any) {
            console.log("New error at src/hooks/auth:signInWithApple --- " + err)
            throw new Error(err)
        }
    }

    async function handleSignInWithApple() {

        try {
            setIsLoginLoading(true)
            signInWithApple()
        }
        catch (err) {
            console.log("New error at src/hooks/auth:handleSignInWithApple --- " + err)
            Alert.alert("Não foi possível conectar a conta Apple")
        } finally {
            setIsLoginLoading(false)
        }
    }

    async function signOut() {
        setUser({} as User)
        return await AsyncStorage.removeItem(userStorageKey)
    }

    useEffect(() => {
        async function loadUseStorageData() {
            const userStorageData = await AsyncStorage.getItem(userStorageKey);

            if (userStorageData) {
                const userLoged = JSON.parse(userStorageData) as User;
                setUser(userLoged)
                setUserStorageLoading(false)
            };
        }
        loadUseStorageData()

    }, [])

    return (

        <AuthContext.Provider value={{
            user,
            handleSignInWithGoogle,
            handleSignInWithApple,
            signOut,
            userStorageLoading,
            isLoginLoading
        }}>
            {children}

        </AuthContext.Provider>
    )
};

function useAuth() {
    const context = useContext(AuthContext)

    return context
}

export { AuthProvider, useAuth }