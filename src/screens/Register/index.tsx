import React, { useState } from 'react';
import {
    Keyboard,
    Modal,
    TouchableWithoutFeedback,
    Alert
} from 'react-native'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'

import { useNavigation } from "@react-navigation/native";
import { useForm } from 'react-hook-form'

import { Button } from '../../components/Forms/Button';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { InputForm } from '../../components/Forms/InputForm';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButon';
import { CategorySelect } from '../CategorySelect'

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes
} from './styles'

type TransactionTypes = "up" | "down";

interface FormData {
    [key: string]: any;
}

type NavigationProps = {
    navigate:(screen:string) => void;
 }

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required("Nome é obrigatório"),

    amount: Yup.number()
    .typeError("Informe um valor numérico")
    .positive("O valor não pode ser negativo")
    .required("Preço é obrigatório")
})

export function Register() {

    const [transactionType, setTransactionType] = useState("" as TransactionTypes);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    })

    const { navigate } = useNavigation<NavigationProps>();

    function handleTransactionTypeButtonSelect(type: TransactionTypes) {
        setTransactionType(type)
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false)
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true)
    }

    async function handleRegister(form: FormData) {

        if (!transactionType) {
            return Alert.alert("Selecione o tipo da transação")
        }

        if (category.key === 'category') {
            return Alert.alert("Selecione a categoria")
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const dataKey = '@gofinances:transactions';
            const data = await AsyncStorage.getItem(dataKey)
            const currentData = data ? JSON.parse(data) : []

            const dataFormated = [
                ...currentData,
                newTransaction
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormated));

            reset()
            setTransactionType("" as TransactionTypes)
            setCategory({
                key: 'category',
                name: 'Categoria',
            });
            navigate('Listagem')

            // await AsyncStorage.removeItem('@gofinances:transactions')
        }
        catch(err) {
            console.log(`screen:src/screens/register/index.ts:Saving transaction on local:handleRegister, \n${err}`)
            Alert.alert("Não foi possível salvar")
        }


    }

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }

    } = useForm({
        resolver: yupResolver(schema)
    });

    return (
        <>
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
            >
                <Container>

                    <Header>
                        <Title>
                            Cadastro
                        </Title>
                    </Header>
                    <Form>
                        <Fields>
                            <InputForm
                                placeholder="Nome"
                                name="name"
                                control={control}
                                autoCapitalize="sentences"
                                autoCorrect={false}
                                error={errors.name && errors.name.message}

                            />
                            <InputForm
                                placeholder='Preço'
                                name="amount"
                                control={control}
                                keyboardType='numeric'
                                error={errors.amount && errors.amount.message}
                            />
                            <TransactionTypes>
                                <TransactionTypeButton
                                    type='up'
                                    title='Income'
                                    onPress={() => handleTransactionTypeButtonSelect("up")}
                                    isActive={transactionType === "up"}
                                />

                                <TransactionTypeButton
                                    type="down"
                                    title="Outcome"
                                    onPress={() => handleTransactionTypeButtonSelect("down")}
                                    isActive={transactionType === "down"}
                                />
                            </TransactionTypes>
                            <CategorySelectButton
                                title={category.name}
                                onPress={handleOpenSelectCategoryModal}
                            />
                        </Fields>

                        <Button
                            title="Enviar"
                            onPress={handleSubmit(handleRegister)}

                        />
                    </Form>
                </Container>
            </TouchableWithoutFeedback>

            <Modal visible={categoryModalOpen} statusBarTranslucent={true}>
                <CategorySelect
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategoryModal}
                />
            </Modal>
        </>
    )

}