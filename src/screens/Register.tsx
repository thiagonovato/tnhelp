import { VStack } from 'native-base';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';

export function Register() {
  return (
    <VStack flex={1} p={6} bg='gray.600'>
      <Header title='New order' />
      <Input placeholder='Number of patrimony' mt={4} />
      <Input
        placeholder='Description'
        flex={1}
        mt={5}
        multiline
        textAlignVertical='top'
      />
      <Button title='Register' mt={5} />
    </VStack>
  );
}
