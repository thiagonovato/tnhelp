import {
  Button,
  Center,
  FormControl,
  Heading,
  HStack,
  Icon,
  Modal,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import auth from '@react-native-firebase/auth';
import { Envelope, Key } from 'phosphor-react-native';
import { useState } from 'react';

import Logo from '../assets/logo_primary_tn.svg';
import { Button as ButtonNew } from '../components/Button';
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
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingForgot, setIsLoadingForgot] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showModalForgot, setShowModalForgot] = useState(false);

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
      setIsLoading(false);
      const msg = msgErros.find((item) => item.code === error.code);
      return Alert.alert('Error', msg?.msg || 'Something went wrong');
    }
  };

  const handleCreateAcount = async () => {
    if (!email || !password) {
      return Alert.alert('Enter', 'Please enter email and password');
    }
    setIsLoadingCreate(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      setIsLoadingCreate(false);
      setShowModal(false);
      return Alert.alert('Success', 'Account created successfully');
    } catch (error) {
      setIsLoadingCreate(false);
      const msg = msgErros.find((item) => item.code === error.code);
      setShowModal(false);
      return Alert.alert('Error', msg?.msg || 'Something went wrong');
    }
  };
  const handleForgotPassword = async () => {
    if (!email) {
      return Alert.alert('Enter', 'Please enter your email');
    }
    setIsLoadingForgot(true);
    try {
      await auth().sendPasswordResetEmail(email);
      setIsLoadingForgot(false);
      setShowModalForgot(false);
      return Alert.alert('Success', 'Email sent successfully');
    } catch (error) {
      setIsLoadingForgot(false);
      const msg = msgErros.find((item) => item.code === error.code);
      setShowModalForgot(false);
      return Alert.alert('Error', msg?.msg || 'Something went wrong');
    }
  };

  const CreateAccount = () => {
    return (
      <Center>
        <Button onPress={() => setShowModal(true)} variant='ghost'>
          <Text color='green.700'>Create Account</Text>
        </Button>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth='400px' bg='gray.600'>
            <Modal.CloseButton />
            <Modal.Header bg='gray.600'>
              <Heading color='gray.100' fontSize='xl'>
                Create Account
              </Heading>
            </Modal.Header>
            <Modal.Body>
              <FormControl>
                <Input
                  placeholder='E=mail'
                  mb={4}
                  InputLeftElement={
                    <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
                  }
                  onChangeText={setEmail}
                />
                <Input
                  placeholder='Password'
                  InputLeftElement={
                    <Icon as={<Key color={colors.gray[300]} />} ml={4} />
                  }
                  secureTextEntry
                  onChangeText={setPassword}
                />
              </FormControl>
            </Modal.Body>
            <Modal.Footer bg='gray.600'>
              <Button.Group space={2}>
                <Button
                  variant='ghost'
                  onPress={() => {
                    setShowModal(false);
                  }}
                  disabled={isLoadingCreate}
                >
                  <Heading color='white' fontSize={'xl'}>
                    Cancel
                  </Heading>
                </Button>
                <ButtonNew
                  title='Create'
                  onPress={handleCreateAcount}
                  isLoading={isLoadingCreate}
                />
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    );
  };
  const ForgotPassword = () => {
    return (
      <Center>
        <Button onPress={() => setShowModalForgot(true)} variant='ghost'>
          <Text color='green.700'>Forgot Password</Text>
        </Button>
        <Modal
          isOpen={showModalForgot}
          onClose={() => setShowModalForgot(false)}
        >
          <Modal.Content maxWidth='400px' bg='gray.600'>
            <Modal.CloseButton />
            <Modal.Header bg='gray.600'>
              <Heading color='gray.100' fontSize='xl'>
                Forgot Password
              </Heading>
            </Modal.Header>
            <Modal.Body>
              <FormControl>
                <Input
                  placeholder='E=mail'
                  InputLeftElement={
                    <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
                  }
                  onChangeText={setEmail}
                />
              </FormControl>
            </Modal.Body>
            <Modal.Footer bg='gray.600'>
              <Button.Group space={2}>
                <Button
                  variant='ghost'
                  onPress={() => {
                    setShowModalForgot(false);
                  }}
                  disabled={isLoadingForgot}
                >
                  <Heading color='white' fontSize={'xl'}>
                    Cancel
                  </Heading>
                </Button>
                <ButtonNew
                  title='Recovery'
                  onPress={handleForgotPassword}
                  isLoading={isLoadingForgot}
                />
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    );
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
      <ButtonNew
        title='Enter'
        w='full'
        onPress={handleSignIn}
        isLoading={isLoading}
      />
      <HStack justifyContent='space-between' w='full' pt={5}>
        {CreateAccount()}
        {ForgotPassword()}
      </HStack>
    </VStack>
  );
}
