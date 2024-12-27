import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icons from './Icons';

const { height } = Dimensions.get('screen');

const EventDetails = ({ event }) => {
    const navigation = useNavigation();

    return (
        <ImageBackground source={require('../assets/back/back.png')} style={{flex:1}}>
            <View style={styles.container}>

                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack('')}>
                    <Icons type={'back'} />
                </TouchableOpacity>

                <Text style={styles.title}>Event</Text>

                <Image source={event.image} style={styles.image} />

                <Text style={styles.name}>{event.name}</Text>

                <View style={styles.locationContainer}>

                    <View style={styles.locationIcon}>
                        <Icons type={'location'} />
                    </View>

                    <Text style={[styles.description, {marginBottom: 0}]}>{event.location}</Text>

                </View>

                <ScrollView style={{width: '100%'}}>
                    {
                        event.description.map((desc, i) => (
                            <Text key={i} style={styles.description}>{desc}</Text>
                        ))
                    }
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

    back: {
        width: 23,
        height: 33,
        position: 'absolute',
        top: height * 0.065,
        left: 20
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: height * 0.03
    },

    image: {
        width: '100%',
        height: 185,
        borderRadius: 12,
        resizeMode: 'cover',
        marginBottom: 11
    },

    name: {
        fontSize: 24,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 12,
        lineHeight: 29
    },

    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 24
    },

    locationIcon: {
        width: 19,
        height: 19,
        marginRight: 8
    },

    description: {
        fontSize: 14,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 17,
        opacity: 0.5 ,
        marginBottom: 15,
        textAlign: 'left',
        width: '100%'
    }

});

export default EventDetails;