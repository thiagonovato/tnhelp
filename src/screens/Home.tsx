import { useNavigation } from '@react-navigation/native';
import {
  Center,
  Heading,
  HStack,
  IconButton,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import Logo from '../assets/logo_secondary_tn.svg';
import { Button } from '../components/Button';
import { Filter } from '../components/Filter';
import { OrderProps, Orders } from '../components/Orders';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Loading } from '../components/Loading';

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>(
    'open'
  );

  const [orders, setOrders] = useState<OrderProps[]>([]);
  const { colors } = useTheme();

  function handleNewOrder() {
    navigation.navigate('new');
  }

  function handleOpenDetails(orderId) {
    navigation.navigate('details', { orderId });
  }

  function handleLogout() {
    auth()
      .signOut()
      .catch(() => {
        Alert.alert('Error', 'Something went wrong');
      });
  }

  useEffect(() => {
    setIsLoading(true);
    const subscribe = firestore()
      .collection('orders')
      .where('status', '==', statusSelected)
      .where('owner', '==', auth().currentUser.uid)
      .onSnapshot((snap) => {
        const data = snap.docs.map((doc) => {
          const { patrimony, description, status, created_at } = doc.data();
          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at),
          };
        });
        setOrders(data);
        setIsLoading(false);
      });
    return subscribe;
  }, [statusSelected]);

  return (
    <VStack flex={1} pb={6} bg='gray.700'>
      <HStack
        w='full'
        justifyContent='space-between'
        bg='gray.600'
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />

        <IconButton
          icon={<SignOut size={20} color={colors.gray[300]} />}
          onPress={handleLogout}
        />
      </HStack>
      <VStack flex={1} px={6}>
        <HStack
          w='full'
          mt={8}
          mb={4}
          justifyContent='space-between'
          alignItems='center'
        >
          <Heading color='gray.100'>My orders</Heading>
          <Text color='gray.200'>{orders.length}</Text>
        </HStack>
        <HStack space={3} mb={8}>
          <Filter
            type='open'
            title='Opened'
            onPress={() => setStatusSelected('open')}
            isActive={statusSelected === 'open'}
          />
          <Filter
            type='closed'
            title='Closed'
            onPress={() => setStatusSelected('closed')}
            isActive={statusSelected === 'closed'}
          />
        </HStack>

        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Orders data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text
                  color={colors.gray[300]}
                  fontSize='xl'
                  mt={6}
                  textAlign='center'
                >
                  You have no {statusSelected === 'open' ? 'opened' : 'closed'}{' '}
                  {'\n'}
                  requests
                </Text>
              </Center>
            )}
          />
        )}
        <Button title='New order' onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
