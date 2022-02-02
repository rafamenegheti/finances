import React from "react";
import {
    Container,
    Header,
    Title,
    Icon,
    Footer,
    Amount,
    LastTransaction
} from "./styles";

interface Props {
    title: "Entradas" | "Saídas" | "Total";
    amount: string;
    lastTransaction: string,
    type: 'up' | 'down' | 'total'
}


export function HighlightCard({ amount, lastTransaction, title, type }: Props) {

    const icon = {
        up: 'arrow-up-circle',
        down: 'arrow-down-circle',
        total: 'dollar-sign'
    }

    const amountInNumber = Number(amount.replace("R$", "").replace(",", "."))
    const noDataMessage = type === "up" ? "entrada" : type === "down" ? "saída" : 'entrada ou saída' 

    return (
        <Container type={type}>
            <Header>
                <Title type={type}>{title}</Title>
                <Icon name={icon[type]} type={type} />

            </Header>

            <Footer>
                <Amount type={type}>{amount}</Amount>
                {amountInNumber !== 0 ?
                    <LastTransaction type={type}>{lastTransaction}</LastTransaction>
                    :
                    <LastTransaction type={type}>{`Nenhuma ${noDataMessage}`}</LastTransaction>
                }
            </Footer>
        </Container>
    )
}