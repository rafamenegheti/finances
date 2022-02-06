import React from "react";
import {
    Container,
    Header,
    Title,
    TitleWrapper,
    SignInTitleWrapper,
    SignInTitle,
    Footer,
    FooterWrapper
} from './styles'
import { Platform } from 'react-native'

import { RFValue } from "react-native-responsive-fontsize";

import { useTheme } from "styled-components";
import GoogleIcon from '../../assets/googleIcon.svg'
import AppleIcon from '../../assets/appleIcon.svg'
import GofinancesLogo from '../../assets/gofinancesLogo.svg'
import { SignInSocialButton } from "../../components/SignInSocialButton";
import { useAuth } from "../../hooks/auth";
import { ActivityIndicator } from "react-native";



export function SignIn() {
    const { handleSignInWithGoogle, handleSignInWithApple, isLoginLoading } = useAuth()
    const theme = useTheme()

    console.log(isLoginLoading)

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <GofinancesLogo
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />

                    <Title>
                        Controle suas {'\n'} finanças de forma {'\n'} muito simples
                    </Title>
                </TitleWrapper>

                <SignInTitleWrapper>
                    <SignInTitle>Faça seu login com</SignInTitle>
                    <SignInTitle>uma das contas abaixo</SignInTitle>
                </SignInTitleWrapper>
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButton
                        title="Entrar com Google"
                        svg={GoogleIcon}
                        onPress={handleSignInWithGoogle}
                    />
                    {
                        Platform.OS === 'ios' &&
                        <SignInSocialButton
                            title="Entrar com Apple"
                            svg={AppleIcon}
                            onPress={handleSignInWithApple}
                        />
                    }

                </FooterWrapper>

                {isLoginLoading && <ActivityIndicator color={theme.colors.shape} size="large" />}

            </Footer>
        </Container>
    )
}