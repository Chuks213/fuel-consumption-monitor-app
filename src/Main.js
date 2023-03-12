import * as React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from './screens/Splash';
import Login from './screens/Login';
import Register from './screens/Register';
import ForgotPassword from './screens/ForgotPassword';
import AuthRouter from './screens/auth/Router';
import {fetchCurrentUser, getUserToken, logout, storeUserToken} from './components/HostMaster';
import { doPost } from "./networking/ApiHelper";
import { loginUrl, userRegistrationUrl } from "./networking/Routes";
import { ToastAndroid, Platform, Alert, LogBox } from 'react-native';


LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  "new NativeEventEmitter"
]);


export const AuthContext = React.createContext();
const Stack = createStackNavigator();

const App = ({ navigation }) => {
    const [state, dispatch] = React.useReducer(
      (prevState, action) => {
        switch (action.type) {
          case 'RESTORE_TOKEN':
            return {
              ...prevState,
              userToken: action.token,
              isLoading: false,
            };
          case 'SIGN_IN':
            return {
              ...prevState,
              isSignout: false,
              userToken: action.token,
            };
          case 'SIGN_OUT':
            return {
              ...prevState,
              isSignout: true,
              userToken: null,
            };
          case 'START_TRIP':
            return {
              ...prevState,
              tripActive: true
            };
          case 'END_TRIP':
            return {
              ...prevState,
              tripActive: false
            };
          case 'DO_REFUEL':
            return {
              ...prevState,
              tripActive: false,
              isRefuel: true
            };
          case 'COMPLETE_REFUEL':
            return {
              ...prevState,
              tripActive: true,
              isRefuel: false
            };
        }
      },
      {
        isLoading: true,
        isSignout: false,
        userToken: null,
        tripActive: false,
        isRefuel: false
      }
    );
  
    React.useEffect(() => {

      const bootstrapAsync = async () => {
        let userToken;
        try {
          const currentUser = await fetchCurrentUser();
          if(currentUser)
            userToken = await getUserToken();
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        // dispatch({ type: 'RESTORE_TOKEN', token: null });
      };

      bootstrapAsync();
    }, []);

    const dispatchNotification = (message, isSuccessResponse) => {
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
      } else {
          Alert.alert(message);
      }
      return !isSuccessResponse ? false : true;
    }
  
    const authContext = React.useMemo(
      () => ({
        signIn: async (data) => {
          const loginResponse = await doPost(loginUrl, data);
          if(loginResponse) {
            if(loginResponse.responseCode == 99) {
              storeUserToken(loginResponse.token);
              dispatch({type: "SIGN_IN", token: loginResponse.token});
              return true;
            }
          }
          return dispatchNotification("Invalid login credentials");
          // dispatch({type: "SIGN_IN", token: "test-token"});
        },
        signOut: () => {
          logout();
          dispatch({ type: 'SIGN_OUT' });
        },
        signUp: async (data) => {
          const registrationResponse = await doPost(userRegistrationUrl, data);
          if(registrationResponse) {
            if(registrationResponse.responseCode == 99) {
              dispatch({ type: 'SIGN_IN' });
              return dispatchNotification("Account created successfully. Kindly login to continue", true);
            }return dispatchNotification(registrationResponse.errorMessage);
          }
          return dispatchNotification("A critical error occurred while trying to create your account. Please try again later");     
          // dispatch({ type: 'SIGN_IN' });   
        },
        performTripAction: (action) => {
          if(action == "START") 
            dispatch({type: 'START_TRIP'});
          else if(action == "END")
            dispatch({type: 'END_TRIP'});
          else if(action == "REFUEL")
            dispatch({type: 'DO_REFUEL'});
          else if(action == "COMPLETE_REFUEL")
            dispatch({type: action});
          // dispatch({type: action == "START" ? 'START_TRIP' : 'END_TRIP'});
        },
        autoSignIn: (newToken) => {
          storeUserToken(newToken);
        }
      }),
      []
    );
  
    return (
      <AuthContext.Provider value={{...authContext, isTripActive: state.tripActive, isRefuel: state.isRefuel}}>
        <NavigationContainer>
          <Stack.Navigator>
            {state.isLoading ? (
              <Stack.Screen name="Splash" component={Splash} options={{headerShown: false}} />
            ) : state.userToken == null ? (
                <>
                    <Stack.Screen name="Login" component={Login} options={{animationTypeForReplace: state.isSignout ? 'pop' : 'push', headerShown: false}} />
                    <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{headerShown: false}} />
                </>
            ) : (
              <Stack.Screen name="AuthRouter" component={AuthRouter} options={{ headerShown: false }} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }
  
export default App;