import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { Loading } from '../components/Loading';
import { SignIn } from '../screens/Signin';

import { AppRoutes } from './app.routes';
export function Routes() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  useEffect(() => {
    const subscribe = auth().onAuthStateChanged((response) => {
      setUser(response);
      setIsLoading(false);
    });
    return subscribe;
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {user ? <AppRoutes /> : <SignIn />}
    </NavigationContainer>
  );
}
