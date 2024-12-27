import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import events from '../constants/events';
import Icons from './Icons';

const { height } = Dimensions.get('screen');

const Events = () => {
    const navigation = useNavigation();

    return (
        <ImageBackground source={require('../assets/back/back.png')} style={{flex:1}}>
            <View style={styles.container}>

                <Text style={styles.title}>Events</Text>

                <ScrollView style={{width: '100%'}}>
                    {
                        events.map((event, index) => (
                            <TouchableOpacity 
                                key={index} 
                                style={styles.card} 
                                onPress={() => navigation.navigate('EventDetailsScreen', {event: event})}
                            >
                                <Image source={event.image} style={styles.image} />
                                <Text style={styles.name}>{event.name}</Text>
                                <View style={styles.locationContainer}>
                                    <View style={styles.locationIcon}>
                                        <Icons type={'location'} />
                                    </View>
                                    <Text style={styles.locationText}>{event.location}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                    <View style={{height: 100}} />
                </ScrollView>

            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        paddingTop: height * 0.07,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: height * 0.03
    },

    card: {
        width: '100%',
        height: 230,
        marginBottom: 24,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },

    image: {
        width: '100%',
        height: 170,
        borderRadius: 12,
        resizeMode: 'cover',
        marginBottom: 11
    },

    name: {
        fontSize: 14,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 7,
        lineHeight: 17
    },

    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },

    locationIcon: {
        width: 19,
        height: 19,
        marginRight: 8
    },

    locationText: {
        fontSize: 12,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 13.31,
        opacity: 0.5
    }

});


export default Events;