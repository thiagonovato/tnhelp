import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { VStack } from 'native-base';
import { Alert } from 'react-native';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';

export function Register() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState('');
  const [description, setDescription] = useState('');

  function handleNewOrderRegister() {
    if (!patrimony || !description) {
      return Alert.alert('Error', 'Put all fields');
    }
    setIsLoading(true);

    firestore()
      .collection('orders')
      .add({
        patrimony,
        description,
        status: 'open',
        created_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        setIsLoading(false);
        setPatrimony('');
        setDescription('');
        Alert.alert('Success', 'Order created');
        navigation.goBack();
      })
      .catch(() => {
        setIsLoading(false);
        Alert.alert('Error', 'Something went wrong');
      });
  }
  return (
    <VStack flex={1} p={6} bg='gray.600'>
      <Header title='New order' />
      <Input
        placeholder='Number of patrimony'
        mt={4}
        onChangeText={setPatrimony}
      />
      <Input
        placeholder='Description'
        flex={1}
        mt={5}
        multiline
        textAlignVertical='top'
        onChangeText={setDescription}
      />
      <Button title='Register' mt={5} onPress={handleNewOrderRegister} />
    </VStack>
  );
}
