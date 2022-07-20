import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Box, HStack, ScrollView, Text, useTheme, VStack } from 'native-base';
import {
  CircleWavyCheck,
  CircleWavyQuestion,
  Clipboard,
  DesktopTower,
  Hourglass,
} from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Button } from '../components/Button';
import { CardDetails } from '../components/CardDetails';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Loading } from '../components/Loading';
import { OrderProps } from '../components/Orders';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormat';

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
};
export function Details() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [isloading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState('');
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert('Error', 'Please, provide a solution');
    }

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert('Success', 'Order closed successfully');
        navigation.goBack();
      })
      .catch(() => {
        Alert.alert('Error', 'Error closing order');
      });
  }
  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          status,
          created_at,
          closed_at,
          solution,
        } = doc.data() as OrderFirestoreDTO;

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          when: dateFormat(created_at),
          closed,
          solution,
        });

        setIsLoading(false);
      });
  }, [orderId]);

  if (isloading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg='gray.700'>
      <Box px={6} bg='gray.600'>
        <Header title='Orders' />
      </Box>
      <HStack bg='gray.500' justifyContent='center' p={4}>
        {order.status === 'closed' ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}
        <Text
          fontSize={'sm'}
          color={
            order.status === 'closed'
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform='uppercase'
        >
          {order.status === 'closed' ? 'Closed' : 'Open'}
        </Text>
      </HStack>
      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title='Equipment'
          description={`Patrimony ${order.patrimony}`}
          icon={DesktopTower}
          footer={order.when}
        />
        <CardDetails
          title='Description'
          description={order.description}
          icon={Clipboard}
        />
        <CardDetails
          title='Solution'
          icon={CircleWavyQuestion}
          description={order.solution}
          footer={order.closed && `Closed at ${order.closed}`}
        >
          {order.status === 'open' && (
            <Input
              placeholder={`Solution description`}
              onChangeText={setSolution}
              textAlignVertical='top'
              multiline
              h={24}
            />
          )}
        </CardDetails>
      </ScrollView>
      {order.status === 'open' && (
        <Button title='Close' m={5} onPress={handleOrderClose} />
      )}
    </VStack>
  );
}
