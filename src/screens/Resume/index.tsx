import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { VictoryPie } from 'victory-native'
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'


import { HistoryCard } from "../../components/HistoryCard";
import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    Month,
    MonthSelectIcon,
    LoadContainer
} from "./styles";
import { TransactionCardProps } from "../../components/TransactionCard";
import { categories } from "../../utils/categories";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { useAuth } from "../../hooks/auth";



interface CategoryData {
    key: string
    name: string,
    total: number,
    totalFormatted: string,
    color: string,
    percent: string
}



export function Resume() {

    const [isLoading, setIsLoading] = useState(false)
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
    const [selectedDate, setSelectedDate] = useState(new Date())

    const theme = useTheme();
    const { user } = useAuth()

    function handleDateChange(action: 'next' | 'prev') {
        if (action == 'next') {
            setSelectedDate(addMonths(selectedDate, 1))
        } else {
            setSelectedDate(subMonths(selectedDate, 1))
        }
    }

    async function loadData() {
        setIsLoading(true)
        const dataKey = `@gofinances:transactions_user:${user.id}`;
        // AsyncStorage.removeItem(`@gofinances:transactions_user:${user.id}`)
        const response = await AsyncStorage.getItem(dataKey)
        const responseFormatted: TransactionCardProps[] = response ? JSON.parse(response) : []

        const expanses = responseFormatted.filter(item =>
            item.type === 'down' &&
            new Date(item.date).getMonth() === selectedDate.getMonth() &&
            new Date(item.date).getFullYear() === selectedDate.getFullYear()
        )

        const expensivesTotal = expanses
            .reduce((acc: number, expense: TransactionCardProps) => {
                return acc + Number(expense.amount)
            }, 0);

        const totalByCategory: CategoryData[] = []

        categories.forEach(category => {
            let categorySum = 0;

            expanses.forEach(expanse => {
                if (expanse.category === category.key) {
                    categorySum += Number(expanse.amount)
                }
            })

            if (Number(categorySum) > 0) {
                const totalFormatted = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })

                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total: categorySum,
                    totalFormatted,
                    color: category.color,
                    percent
                })
            }
            setIsLoading(false)
        })

        setTotalByCategories(totalByCategory)


    }


    useFocusEffect(useCallback(() => {
        loadData()
    }, [selectedDate]));


    return (
        <Container>



            <Header>
                <Title>Resumo de gastos</Title>
            </Header>
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
                        <Content
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: 24,
                                paddingBottom: useBottomTabBarHeight(),
                            }}
                        >
                            <MonthSelect>
                                <MonthSelectButton
                                    onPress={() => handleDateChange('prev')}
                                >
                                    <MonthSelectIcon name="chevron-left" />
                                </MonthSelectButton>

                                <Month>
                                    {format(selectedDate, 'MMMM, yyyy', {
                                        locale: ptBR
                                    })}
                                </Month>

                                <MonthSelectButton
                                    onPress={() => handleDateChange('next')}
                                >
                                    <MonthSelectIcon name="chevron-right" />
                                </MonthSelectButton>
                            </MonthSelect>
                            <ChartContainer>
                                <VictoryPie
                                    data={totalByCategories}
                                    x="percent"
                                    y="total"
                                    colorScale={totalByCategories.map(category => category.color)}
                                    style={{
                                        labels: {
                                            fontSize: RFValue(18),
                                            fill: theme.colors.shape,
                                            fontFamily: theme.fonts.bold
                                        }
                                    }}
                                    labelRadius={50}
                                />
                            </ChartContainer>
                            {
                                totalByCategories.map(item => (
                                    <HistoryCard
                                        key={item.key}
                                        title={item.name}
                                        amount={item.totalFormatted}
                                        color={item.color}
                                    />
                                ))

                            }
                        </Content>
                    </>
            }
        </Container>
    )
}