import { Heading, Icon, useTheme, VStack } from 'native-base';
import auth from '@react-native-firebase/auth';
import { Envelope, Key } from 'phosphor-react-native';
import { useState } from 'react';

import Logo from '../assets/logo_primary_tn.svg';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Alert } from 'react-native';

const msgErros = [
  {
    code: 'auth/user-not-found',
    msg: 'E-mail not found.',
  },
  {
    code: 'auth/invalid-email',
    msg: 'Invalid email.',
  },
  {
    code: 'auth/wrong-password',
    msg: 'Wrong password.',
  },
  {
    code: 'auth/too-many-requests',
    msg: 'Too many requests. Wait a minute and try again.',
  },
];
export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { colors } = useTheme();

  const handleSignIn = async () => {
    if (!email || !password) {
      return Alert.alert('Enter', 'Please enter email and password');
    }
    setIsLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      const msg = msgErros.find((item) => item.code === error.code);
      return Alert.alert('Error', msg?.msg || 'Something went wrong');
    }
  };
  return (
    <VStack flex={1} alignItems='center' bg='gray.600' px={8} pt={24}>
      <Logo />
      <Heading color='gray.100' fontSize='xl' mt={20} mb={6}>
        Access your account
      </Heading>
      <Input
        placeholder='E=mail'
        mb={4}
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={setEmail}
      />
      <Input
        mb={8}
        placeholder='Password'
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button
        title='Enter'
        w='full'
        onPress={handleSignIn}
        isLoading={isLoading}
      />
    </VStack>
  );
}
