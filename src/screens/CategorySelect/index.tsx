import React from 'react'
import { FlatList } from 'react-native'
import { categories } from '../../utils/categories'
import { 
    Container,
    Title,
    Header,
    HeaderTitle,
    Category,
    Icon,
    Name,
    Separator,
    Footer,
} from './styles'

import { Button } from '../../components/Forms/Button'


interface Category {
    key: string;
    name: string;
}

interface Props {
    category: Category;
    setCategory: (Category: Category) => void;
    closeSelectCategory: () => void

}


export function CategorySelect({ category, setCategory, closeSelectCategory }: Props) {


    function handleCategorySelect(item: Category) {
        setCategory(item);
    }


    return(
        <Container> 
            <Header>
                <HeaderTitle>Categorias</HeaderTitle>
            </Header>

            <FlatList
                data={categories}
                style={{ flex: 1, width: '100%'}}
                keyExtractor={(item) => item.key}
                ItemSeparatorComponent={Separator}
                renderItem={({ item}) => (
                    <Category
                        onPress={() => handleCategorySelect(item)}
                        isActive={category.key === item.key}
                    >       
                        <Icon name={item.icon}/>
                        <Name>{item.name}</Name>
                    </Category>
                )}
            />

            <Footer>
                <Button 
                    title="Selecionar"
                    onPress={closeSelectCategory}
                />
            </Footer>

        </Container>
    )
}