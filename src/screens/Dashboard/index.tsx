import React, { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

import { View } from 'react-native';
import { ActivityIndicator } from 'react-native';

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCardProps, TransactionCard } from '../../components/TransactionCard'
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
    TransactionList,
    LogoutButton,
    LoadContainer
} from './styles'

export interface DataListProps extends TransactionCardProps {
    id: string
}

interface HighlightProps {
    total: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps;
    expenses: HighlightProps
    balance: HighlightProps
}

export function Dashboard() {

    const [isLoading, setIsLoading] = useState(true)
    const [transactions, setTransactions] = useState<DataListProps[]>([])
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);


    function getLastTransactionDate(type: 'up' | 'down') {
        const lastTransactions = new Date(
            Math.max.apply(Math,
                transactions.filter(item => item.type === type)
                    .map(item => new Date(item.date).getTime())
            )
        );

        return `${lastTransactions.getDate()} de ${lastTransactions.toLocaleString('pt-BR', {
            month: 'narrow',
            year: '2-digit'
        })}`
    }


    async function loadTransactions() {

        const dataKey = '@gofinances:transactions';

        let entriesTotal = 0;
        let expensesTotal = 0;

        try {
            const response = await AsyncStorage.getItem(dataKey);

            const transactions: DataListProps[] = response ? JSON.parse(response) : [];


            const transactionsFormated: DataListProps[] = transactions.map((item: DataListProps) => {

                if (item.type === 'up') {
                    entriesTotal += Number(item.amount)
                }
                else {
                    expensesTotal += Number(item.amount)
                }

                const amount = Number(item.amount)
                    .toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });

                const date = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(new Date(item.date))

                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date
                }
            });

            setTransactions(transactionsFormated);

            const lastTransactionEntries = getLastTransactionDate('up');
            const lastTransactionsExpenses = getLastTransactionDate('down');
            const totalInterval = `dia primeiro até ${lastTransactionsExpenses}`;

            setHighlightData({
                entries: {
                    total: entriesTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    lastTransaction: lastTransactionEntries
                },
                expenses: {
                    total: expensesTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    lastTransaction: lastTransactionsExpenses
                },
                balance: {
                    total: (entriesTotal - expensesTotal).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    lastTransaction: totalInterval
                }
            })

            setIsLoading(false)

        } catch (err) {

            console.log(`src/screens/Dashboard/index.tsx:loadTransaction ${err}`)
        }
    }

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));

    return (
        <Container>
            {
                isLoading ?
                    <LoadContainer>
                        <ActivityIndicator
                            color='orange'
                            size={'large'}
                        />
                    </LoadContainer>
                    :
                    <>
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
                                <LogoutButton
                                    onPress={() => { }}
                                >
                                    <View accessible>
                                        <Icon name="power" />
                                    </View>
                                </LogoutButton>
                            </UserWrapper>

                        </Header>

                        <HighlightCards

                        >
                            <HighlightCard
                                title='Entradas'
                                amount={highlightData.entries.total}
                                lastTransaction={`Última entrada dia ${highlightData.entries.lastTransaction}`}
                                type='up'
                            />
                            <HighlightCard
                                title='Saídas'
                                amount={highlightData.expenses.total}
                                lastTransaction={`Última saída dia ${highlightData.expenses.lastTransaction}`}
                                type="down"
                            />
                            <HighlightCard
                                title='Total'
                                amount={highlightData.balance.total}
                                lastTransaction={highlightData.balance.lastTransaction}
                                type='total'
                            />
                        </HighlightCards>

                        <Transactions>
                            <Title>Listagem</Title>

                            <TransactionList
                                data={transactions}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => <TransactionCard data={item} />}
                            />
                        </Transactions>
                    </>
            }
        </Container>
    )
}

