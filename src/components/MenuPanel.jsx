import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const { height } = Dimensions.get('window');

const MenuPanel = () => {
    const navigation = useNavigation();
    const [activeButton, setActiveButton] = useState('HomeScreen');

    const handleNavigate = (screen) => {
        setActiveButton(screen);
        navigation.navigate(screen)
    };    

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const currentRoute = navigation.getState().routes[navigation.getState().index].name;
            setActiveButton(currentRoute);
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.container}>

            <View style={[styles.btnContainer, activeButton === 'HomeScreen' && {backgroundColor: '#ed2124'}]}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleNavigate('HomeScreen')}>
                    <Icons type={'home'} active={activeButton === 'HomeScreen'}/>
                </TouchableOpacity>
            </View>

            <View style={[styles.btnContainer, activeButton === 'CommunityScreen' && {backgroundColor: '#ed2124'}]}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleNavigate('CommunityScreen')}>
                    <Icons type={'community'} active={activeButton === 'CommunityScreen'}/>
                </TouchableOpacity>
            </View>

            <View style={[styles.btnContainer, activeButton === 'EventsScreen' && {backgroundColor: '#ed2124'}]}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleNavigate('EventsScreen')}>
                    <Icons type={'event'} active={activeButton === 'EventsScreen'}/>
                </TouchableOpacity>
            </View>

            <View style={[styles.btnContainer, activeButton === 'ProfileScreen' && {backgroundColor: '#ed2124'}]}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleNavigate('ProfileScreen')}>
                    <Icons type={'profile'} active={activeButton === 'ProfileScreen'}/>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        width: "100%",
        height: height * 0.14,
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 9,
        flexDirection: 'row',
        backgroundColor: '#2b2b2b',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignSelf: "center",
    },
    
    btnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 75,
        height: 55,
        borderRadius: 100,
        backgroundColor: '#000',
    },

    button: {
        width: 26,
        height: 26
    },
});

export default MenuPanel;
