import React from 'react'
import { View } from 'react-native'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard } from '../../components/TransactionCard'
import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList
} from './styles'


export function Dashboard() {

    const data = [{
        amount: 'R$ 150,00',
        title: 'Venda se site',
        date: '24/12/2021',
        category: {
            icon: "dollar-sign",
            name: "pinto",
        }
    },
    {
        amount: 'R$ 150,00',
        title: 'Venda se site',
        date: '24/12/2021',
        category: {
            icon: "dollar-sign",
            name: "pinto",
        }
    },
    {
        amount: 'R$ 150,00',
        title: 'Venda se site',
        date: '24/12/2021',
        category: {
            icon: "dollar-sign",
            name: "pinto",
        }
    }]

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo
                            source={{ uri: 'https://avatars.githubusercontent.com/u/88295512?v=4' }}
                        />
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Rafael</UserName>
                        </User>
                    </UserInfo>
                    <Icon name="power" />
                </UserWrapper>

            </Header>

            <HighlightCards

            >
                <HighlightCard
                    title='Entradas'
                    amount='R$ 17.4006666666666666666666666666,00'
                    lastTransaction='Última entrada dia 13 de março'
                    type='up'
                />
                <HighlightCard
                    title='Saídas'
                    amount='R$ 17.400,00'
                    lastTransaction='Última entrada dia 13 de março'
                    type="down"
                />
                <HighlightCard
                    title='Total'
                    amount='R$ 17.400,00'
                    lastTransaction='Última entrada dia 13 de março'
                    type='total'
                />
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>

                <TransactionList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: getBottomSpace()
                    }}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />
            </Transactions>
        </Container>
    )
}

