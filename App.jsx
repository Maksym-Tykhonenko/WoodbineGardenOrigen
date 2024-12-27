import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Image, Animated, View, Text} from 'react-native';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import DreamsScreen from './src/screens/DreamsScreen';
import DreamDetailsScreen from './src/screens/DreamDetailsScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import ProjectDetailsScreen from './src/screens/ProjectDetailsScreen';
import DesiresScreen from './src/screens/DesiresScreen';
import DesireDetailsScreen from './src/screens/DesireDetailsScreen';
import PlantsScreen from './src/screens/PlantsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import PostDetailsScreen from './src/screens/PostDetailsScreen';
import EventsScreen from './src/screens/EventsScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';
/////////////////
import WoodbineGardenOrigenProdactScreen from './src/screens/WoodbineGardenOrigenProdactScreen';
/////////////////
import ReactNativeIdfaAaid, {
  AdvertisingInfoResponse,
} from '@sparkfabrik/react-native-idfa-aaid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import appsFlyer from 'react-native-appsflyer';
import AppleAdsAttribution from '@vladikstyle/react-native-apple-ads-attribution';
import DeviceInfo from 'react-native-device-info';

enableScreens();

const Stack = createStackNavigator();

const App = () => {
  const [route, setRoute] = useState(false);
  //console.log('route===>', route);
  const [responseToPushPermition, setResponseToPushPermition] = useState(false);
  ////('Дозвіл на пуши прийнято? ===>', responseToPushPermition);
  const [uniqVisit, setUniqVisit] = useState(true);
  //console.log('uniqVisit===>', uniqVisit);
  const [addPartToLinkOnce, setAddPartToLinkOnce] = useState(true);
  //console.log('addPartToLinkOnce in App==>', addPartToLinkOnce);
  //////////////////Parametrs
  const [idfa, setIdfa] = useState(false);
  //console.log('idfa==>', idfa);
  const [oneSignalId, setOneSignalId] = useState(null);
  //console.log('oneSignalId==>', oneSignalId);
  const [appsUid, setAppsUid] = useState(null);
  const [sab1, setSab1] = useState();
  const [pid, setPid] = useState();
  //console.log('appsUid==>', appsUid);
  //console.log('sab1==>', sab1);
  //console.log('pid==>', pid);
  const [customerUserId, setCustomerUserId] = useState(null);
  //console.log('customerUserID==>', customerUserId);
  const [idfv, setIdfv] = useState();
  //console.log('idfv==>', idfv);
  /////////Atributions
  const [adServicesAtribution, setAdServicesAtribution] = useState(null);
  //const [adServicesKeywordId, setAdServicesKeywordId] = useState(null);

  const INITIAL_URL = `https://fun-de-charlevoix.com/`;
  const URL_IDENTIFAIRE = `Z78QWgmj`;

  // Генеруємо унікальний ID користувача з timestamp
  /////////////Timestamp + user_id generation
  const timestamp_user_id = `${new Date().getTime()}-${Math.floor(
    1000000 + Math.random() * 9000000,
  )}`;
  //console.log('idForTag', timestamp_user_id);

  useEffect(() => {
    checkUniqVisit();
    getData();
  }, []);

  // uniq_visit
  const checkUniqVisit = async () => {
    const uniqVisitStatus = await AsyncStorage.getItem('uniqVisitStatus');
    if (!uniqVisitStatus) {
      await fetch(
        `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=uniq_visit&jthrhg=${timestamp_user_id}`,
      );
      //console.log('унікальний візит!!!');
      setUniqVisit(false);
      await AsyncStorage.setItem('uniqVisitStatus', 'sent');
    }
  };

  const getData = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('App');
      if (jsonData !== null) {
        const parsedData = JSON.parse(jsonData);
        //console.log('Дані дістаються в AsyncStorage');
        //console.log('parsedData in App==>', parsedData);
        //setAddPartToLinkOnce(parsedData.addPartToLinkOnce);
        setRoute(parsedData.route);
        setResponseToPushPermition(parsedData.responseToPushPermition);
        setUniqVisit(parsedData.uniqVisit);
        setOneSignalId(parsedData.oneSignalId);
        setIdfa(parsedData.idfa);
        setAppsUid(parsedData.appsUid);
        setSab1(parsedData.sab1);
        setPid(parsedData.pid);
        setCustomerUserId(parsedData.customerUserId);
        setIdfv(parsedData.idfv);
        setAdServicesAtribution(parsedData.adServicesAtribution);
        //setAdServicesKeywordId(parsedData.adServicesKeywordId);
        await performAppsFlyerOperationsContinuously();
      } else {
        console.log('Даних немає в AsyncStorage');
        await fetchIdfa();
        await requestOneSignallFoo();
        await performAppsFlyerOperations();
        await getUidApps();
        //await fetchAdServicesAttributionData(); // Вставка функції для отримання даних

        onInstallConversionDataCanceller();
      }
    } catch (e) {
      console.log('Помилка отримання даних в getData:', e);
    }
  };

  const setData = async () => {
    try {
      const data = {
        route,
        responseToPushPermition,
        uniqVisit,
        oneSignalId,
        idfa,
        appsUid,
        sab1,
        pid,
        customerUserId,
        idfv,
        adServicesAtribution,
        //adServicesKeywordId,
      };
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem('App', jsonData);
      //console.log('Дані збережено в AsyncStorage');
    } catch (e) {
      //console.log('Помилка збереження даних:', e);
    }
  };

  useEffect(() => {
    setData();
  }, [
    route,
    responseToPushPermition,
    uniqVisit,
    oneSignalId,
    idfa,
    appsUid,
    sab1,
    pid,
    customerUserId,
    idfv,
    adServicesAtribution,
    //adServicesKeywordId,
  ]);

  const fetchAdServicesAttributionData = async () => {
    try {
      const adServicesAttributionData =
        await AppleAdsAttribution.getAdServicesAttributionData();
      console.log('adservices' + adServicesAttributionData);

      // Извлечение значений из объекта
      ({attribution} = adServicesAttributionData); // Присваиваем значение переменной attribution
      ({keywordId} = adServicesAttributionData);

      setAdServicesAtribution(attribution);
      //setAdServicesKeywordId(keywordId);
      setSab1(attribution);
      // Вывод значений в консоль
      //Alert.alert(`Attribution: ${attribution}`);
      //console.log(`Attribution: ${attribution}` + `KeywordId:${keywordId}`);
    } catch (error) {
      const {message} = error;
      // Alert.alert(message); // --> Some error message
    }
  };

  ///////// OneSignall
  const requestPermission = () => {
    return new Promise((resolve, reject) => {
      try {
        OneSignal.Notifications.requestPermission(true).then(res => {
          console.log('res', res);
          // зберігаємо в Стейт стан по відповіді на дозвіл на пуши і зберігаємо їх в АсСторідж
          setResponseToPushPermition(res);
        });

        resolve(); // Викликаємо resolve(), оскільки OneSignal.Notifications.requestPermission не повертає проміс
      } catch (error) {
        reject(error); // Викликаємо reject() у разі помилки
      }
    });
  };

  // Виклик асинхронної функції requestPermission() з використанням async/await
  const requestOneSignallFoo = async () => {
    try {
      await requestPermission();
      // Якщо все Ok
    } catch (error) {
      console.log('err в requestOneSignallFoo==> ', error);
    }
  };

  // Remove this method to stop OneSignal Debugging
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal ініціалізація
  OneSignal.initialize('f4cee9b5-9576-478a-98ac-f6308655db3e');
  //OneSignal.Debug.setLogLevel(OneSignal.LogLevel.Verbose);

  ////////////////////OneSignall Id generation
  useEffect(() => {
    const fetchOneSignalId = async () => {
      try {
        const deviceState = await OneSignal.User.getOnesignalId();
        if (deviceState) {
          setOneSignalId(deviceState); //  OneSignal ID
        }
      } catch (error) {
        console.error('Error fetching OneSignal ID:', error);
      }
    };

    fetchOneSignalId();
  }, []);

  OneSignal.Notifications.addEventListener('click', event => {
    if (event.notification.launchURL) {
      fetch(
        `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=push_open_browser&jthrhg=${timestamp_user_id}`,
      );
      //fetch(
      //  `${event.notification.launchURL}?utretg=push_open_browser&jthrhg=${timestamp_user_id}`,
      //);
      console.log('івент push_open_browser OneSignal');
    } else {
      fetch(
        `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=push_open_webview&jthrhg=${timestamp_user_id}`,
      );
      setAddPartToLinkOnce(false);
      console.log('iвент push_open_webview OneSignal');

      // Єдиноразово додати до лінки product &yhugh=true

      //fetch(
      //  `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=webview_open&jthrhg=${timestamp_user_id}`,
      //);
      //console.log('івент webview_open OneSignal');
    }
    //console.log('OneSignal: url:', event.notification.launchURL);
    //console.log('OneSignal: event:', event);
  });

  const performAppsFlyerOperationsContinuously = async () => {
    try {
      // 1. Ініціалізація SDK
      await new Promise((resolve, reject) => {
        appsFlyer.initSdk(
          {
            devKey: 'Auev5TVyfZU5UQJqwrQ3XS',
            appId: '6739550536',
            isDebug: true,
            onInstallConversionDataListener: true,
            onDeepLinkListener: true,
            timeToWaitForATTUserAuthorization: 10,
            manualStart: true, // Тепер ініціалізація без автоматичного старту
          },
          resolve,
          reject,
        );
      });

      appsFlyer.startSdk();
      console.log('StartAppsFly');
    } catch (error) {
      console.log(
        'App.js Помилка під час виконання операцій AppsFlyer:',
        error,
      );
    }
  };

  ///////// AppsFlyer
  // 1ST FUNCTION - Ініціалізація AppsFlyer
  const performAppsFlyerOperations = async () => {
    try {
      // 1. Ініціалізація SDK
      await new Promise((resolve, reject) => {
        appsFlyer.initSdk(
          {
            devKey: 'Auev5TVyfZU5UQJqwrQ3XS',
            appId: '6739550536',
            isDebug: true,
            onInstallConversionDataListener: true,
            onDeepLinkListener: true,
            timeToWaitForATTUserAuthorization: 10,
            manualStart: true, // Тепер ініціалізація без автоматичного старту
          },
          resolve,
          reject,
        );
      });

      appsFlyer.startSdk();

      //console.log('App.js AppsFlyer ініціалізовано успішно');
      //Alert.alert('App.js AppsFlyer ініціалізовано успішно');
      // Отримуємо idfv та встановлюємо його як customerUserID
      const uniqueId = await DeviceInfo.getUniqueId();
      setIdfv(uniqueId); // Зберігаємо idfv у стейті

      appsFlyer.setCustomerUserId(uniqueId, res => {
        //console.log('Customer User ID встановлено успішно:', uniqueId);
        setCustomerUserId(uniqueId); // Зберігаємо customerUserID у стейті
      });
    } catch (error) {
      console.log(
        'App.js Помилка під час виконання операцій AppsFlyer:',
        error,
      );
    }
  };

  // 2ND FUNCTION - Ottrimannya UID AppsFlyer
  const getUidApps = async () => {
    try {
      const appsFlyerUID = await new Promise((resolve, reject) => {
        appsFlyer.getAppsFlyerUID((err, uid) => {
          if (err) {
            reject(err);
          } else {
            resolve(uid);
          }
        });
      });
      //console.log('on getAppsFlyerUID: ' + appsFlyerUID);
      //Alert.alert('appsFlyerUID', appsFlyerUID);
      setAppsUid(appsFlyerUID);
    } catch (error) {
      //console.error(error);
    }
  };

  // 3RD FUNCTION - Отримання найменування AppsFlyer
  const onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
    async res => {
      // Додаємо async
      try {
        const isFirstLaunch = JSON.parse(res.data.is_first_launch);
        if (isFirstLaunch === true) {
          if (res.data.af_status === 'Non-organic') {
            const media_source = res.data.media_source;
            //console.log('App.js res.data==>', res.data);

            const {campaign, pid, af_adset, af_ad, af_os} = res.data;
            setSab1(campaign);
            setPid(pid);
          } else if (res.data.af_status === 'Organic') {
            // Викликаємо fetchAdServicesAttributionData і отримуємо attribution
            const adServicesAttributionData =
              await fetchAdServicesAttributionData();
            const attribution = adServicesAttributionData?.attribution || 'asa'; // Якщо attribution немає, встановлюємо 'aca'
            setSab1(attribution); // Записуємо в стейт
            // setSab1(attribution ? 'asa' : ''); 
          }
        } else {
          //console.log('This is not first launch');
        }
      } catch (error) {
        console.log('Error processing install conversion data:', error);
      }
    },
  );
  ///////// IDFA
  const fetchIdfa = async () => {
    try {
      const res = await ReactNativeIdfaAaid.getAdvertisingInfo();
      if (!res.isAdTrackingLimited) {
        setIdfa(res.id);
        //console.log('setIdfa(res.id);');
      } else {
        //console.log('Ad tracking is limited');
        setIdfa(false); //true
        //setIdfa(null);
        fetchIdfa();
        //Alert.alert('idfa', idfa);
      }
    } catch (err) {
      //console.log('err', err);
      setIdfa(null);
      await fetchIdfa(); //???
    }
  };

  ///////// Route useEff
  useEffect(() => {
    const checkUrl = `${INITIAL_URL}${URL_IDENTIFAIRE}`;
    //console.log(checkUrl);

    const targetData = new Date('2024-12-18T10:00:00'); //дата з якої поч працювати webView
    const currentData = new Date(); //текущая дата

    if (!route) {
      if (currentData <= targetData) {
        setRoute(false);
      } else {
        fetch(checkUrl)
          .then(r => {
            if (r.status === 200) {
              console.log('status по клоаке==>', r.status);
              setRoute(true);
            } else {
              setRoute(false);
            }
          })
          .catch(e => {
            //console.log('errar', e);
            setRoute(false);
          });
      }
    }
    return;
  }, []);

    ///////// Route
    const Route = ({ isFatch }) => {
        if (isFatch) {
            return (
                <Stack.Navigator>
                    <Stack.Screen
                        initialParams={{
                            //addPartToLinkOnce,
                            //responseToPushPermition, //в вебВью якщо тру то відправити івент push_subscribe
                            //oneSignalId, //додати до фінальної лінки
                            //idfa: idfa,
                            //sab1: sab1,
                            //pid: pid,
                            //uid: appsUid,
                            //customerUserId: customerUserId,
                            //idfv: idfv,
                            //adAtribution: adServicesAtribution,
                        }}
                        name="WoodbineGardenOrigenProdactScreen"
                        component={WoodbineGardenOrigenProdactScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            );
        }
        return (
            <Stack.Navigator initialRouteName="HomeScreen">
                  <Stack.Screen 
                      name="HomeScreen" 
                      component={HomeScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="DreamsScreen" 
                      component={DreamsScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="DreamDetailsScreen" 
                      component={DreamDetailsScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="ProjectsScreen" 
                      component={ProjectsScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="ProjectDetailsScreen" 
                      component={ProjectDetailsScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="DesiresScreen" 
                      component={DesiresScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="DesireDetailsScreen" 
                      component={DesireDetailsScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="PlantsScreen" 
                      component={PlantsScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="ProfileScreen" 
                      component={ProfileScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="CommunityScreen" 
                      component={CommunityScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="PostDetailsScreen" 
                      component={PostDetailsScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="EventsScreen" 
                      component={EventsScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="EventDetailsScreen" 
                      component={EventDetailsScreen} 
                      options={{ headerShown: false }} 
                  />
              </Stack.Navigator>  
        );
    };

    ///////// Louder
    const [louderIsEnded, setLouderIsEnded] = useState(false);
    const appearingAnim = useRef(new Animated.Value(0)).current;
    const appearingSecondAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(appearingAnim, {
            toValue: 1,
            duration: 3500,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            Animated.timing(appearingSecondAnim, {
                toValue: 1,
                duration: 7500,
                useNativeDriver: true,
            }).start();
            //setLouderIsEnded(true);
        }, 500);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setLouderIsEnded(true);
        }, 8000);
    }, []);
  
    return (
        <NavigationContainer>
            {!louderIsEnded ? (
                <View
                    style={{
                        position: 'relative',
                        flex: 1,
                        //backgroundColor: 'rgba(0,0,0)',
                    }}>
                    <Animated.Image
                        source={require('./src/assets/back/loader1.png')}
                        style={{
                            //...props.style,
                            opacity: appearingAnim,
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                        }}
                    />
                    <Animated.Image
                        source={require('./src/assets/back/loader2.png')}
                        style={{
                            //...props.style,
                            opacity: appearingSecondAnim,
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                        }}
                    />
                </View>
            ): (
                <Route isFatch={true}/>  
            )}
              
          </NavigationContainer>
    );
};

export default App;
