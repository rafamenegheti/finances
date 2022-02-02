import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";


interface ContainerProps {
    color: string
}

export const Container = styled.View<ContainerProps>`
    width: 100%;

    background-color: ${({ theme }) => theme.colors.shape};

    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 20px 13px;

    border-radius: 5px;
    border-left-width: 5px;
    border-left-color: ${({ color }) => color};
    
    margin-bottom: ${RFValue(8)}px;
    
    
`

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(15)}px;
    line-height: ${RFValue(17)}px;
    
`

export const Amount = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: ${RFValue(15)}px;
    line-height: ${RFValue(17)}px;
    
`